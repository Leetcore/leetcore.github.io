from typing import Dict, List
import toml
from datetime import datetime
import glob
import re
import bs4

template_index_filename = "template/index.html"
template_post_filename = "template/post.html"

with open("config.toml", "r") as config:
    parsed_config = toml.loads(config.read())

# generate new post based on template
print("New post? Input filename (or skip with enter):")
new_filename = input()
new_filename = new_filename.strip().lower()
if len(new_filename.strip()) > 0:
    if ".html" not in new_filename:
        new_filename = new_filename + ".html"

    # ask for headline
    print("Headline:")
    new_headline = input()

    # build date string
    timestamp = datetime.now()
    today = timestamp.strftime("%d.%m.%Y")

    with open(template_post_filename, "r") as template:
        with open(f"{new_filename}", "w") as new_file:
            template_content = template.read()
            template_content = template_content.replace(
                "[#HEADLINE#]", new_headline)
            template_content = template_content.replace("[#DATE#]", today)
            new_file.write(template_content)
    
    print("Write your content now and press enter to continue...")
    lala = input()

def read_blog_posts():
    posts: List[Dict[str, str]] = []
    for filename in glob.glob(f"*.html"):
        # skip index file
        if ("index.html" in filename):
            continue
        with open(filename) as f:
            # default values
            headline = ""
            description = ""
            the_date = datetime.now()

            # parse html content
            content = f.read()
            soup = bs4.BeautifulSoup(content, "html.parser")

            # read and format date
            date_tag_content = soup.find(id="date")
            if date_tag_content:
                date_string = re.search(
                    r"\d\d\.\d\d\.\d\d\d\d", date_tag_content.text)
                if date_string:
                    the_date = datetime.strptime(
                        date_string.group(), "%d.%m.%Y")
            pubdate = the_date.strftime("%a, %d %b %Y %H:%M:%S +0100")

            # find headline
            headline_tag = soup.find("h1")
            if headline_tag:
                headline = headline_tag.text
            print(headline)

            # find description
            description_tag = soup.find("p")
            if description_tag:
                description = description_tag.text

            # build link
            link = filename
            guid = filename

            posts.append({
                'headline': headline,
                'description': description,
                'pubdate': pubdate,
                'link': link,
                'guid': guid
            })
    return sorted(posts, key=lambda item: item['pubdate'])

def generate_post_output(posts: List[Dict[str, str]]):
    for post in posts:
        # build items for rss feed
        rss_output.append("<item>")
        rss_output.append(f'<title>{post.get("headline")}</title>')
        rss_output.append(
            f'<description>{post.get("description")}</description>')
        rss_output.append(
            f'<link>{parsed_config["link"]}{parsed_config["public_folder"]}{parsed_config["post_folder"]}{post.get("link")}</link>')
        rss_output.append(
            f'<guid>{parsed_config["link"]}{parsed_config["public_folder"]}{parsed_config["post_folder"]}{post.get("guid")}</guid>')
        rss_output.append(f'<pubDate>{post.get("pubdate")}</pubDate>')
        rss_output.append("</item>")

        # build html elements for index
        element_list.append('<li>')
        element_list.append(
            f'<a href="{post.get("link")}">{post.get("headline")}</a>')
        element_list.append(f'<p>{post.get("description")}... <a href="{post.get("link")}">Weiterlesen</a></p>')
        element_list.append('</li>')


def write_files():
    # write rss file
    with open(f"feed.rss", "w") as f:
        print("Write feed.rss...")
        f.write("\n".join(rss_output))

    # build index based on template
    with open(template_index_filename, "r") as f:
        # read file content
        content = f.read()
        # replace placeholder with index elements
        new_content = content.replace(
            "[#BLOG_INDEX#]", "\n".join(element_list))

    # write to file
    with open(f"index.html", "w") as f:
        print("Write index.html...")
        f.write(new_content)


element_list: list[str] = []
element_list.append("<ul>")

rss_output: list[str] = []
rss_output.append('<?xml version="1.0" encoding="utf-8"?>')
rss_output.append(
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">')
rss_output.append('<channel>')

# read config and blog settings
rss_output.append(f'<title>{parsed_config["title"]}</title>')
rss_output.append(f'<link>{parsed_config["link"]}</link>')
rss_output.append(f'<description>{parsed_config["description"]}</description>')
rss_output.append(
    f'<atom:link href="{parsed_config["link"]}{parsed_config["public_folder"]}feed.rss" rel="self" type="application/rss+xml" />')

# build post output
blog_posts = read_blog_posts()
generate_post_output(blog_posts)

# close elements
rss_output.append('</channel>\n</rss>')
element_list.append("</ul>")

# write to disk
write_files()