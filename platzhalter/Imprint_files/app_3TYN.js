import { translations } from './translations.js';
var appModel = {
    inputDomain: ko.observable(""),
    inputEmail: ko.observable(""),
    inputSearchHosts: ko.observable(""),
    inputReport: ko.observable(""),
    availableReportsJSON: ko.observableArray(),
    availableReports: ko.observableArray(),
    downloadThisReport: ko.observable(""),
    language: ko.observable("de"),
    hosts: ko.observableArray(),
    filteredHosts: ko.observableArray(),
    projects: ko.observableArray(),
    alerts: ko.observableArray(),
    known_exploits: ko.observableArray(),
    leaks: ko.observableArray(),
    filteredLeaks: ko.observableArray(),
    stats: ko.observableArray(),
    serverStats: ko.observableArray(),
    feed_zeroday: ko.observable(""),
    feed_cyberattack: ko.observable(""),
    scanStatus: ko.observableArray(),
    data: ko.observableArray(),
    info: ko.observable(),
    summary: ko.observable(),
    payment_methods: ko.observableArray(),
    message: ko.observable(),
    scanInfo: ko.observable(),
    subdomains: ko.observable(),
    technology: ko.observableArray(),
    totalprice_monthly: ko.observable("_"),
    totalprice_weekly: ko.observable("_"),
    company_name: ko.observable(""),
    firstname: ko.observable(""),
    lastname: ko.observable(""),
    street_and_number: ko.observable(""),
    zip_code: ko.observable(""),
    location: ko.observable(""),
    country: ko.observable([]),
    iban: ko.observable(""),
    has_flatrate: ko.observable(false),
    notification: ko.observable(true),
    newsletter: ko.observable(true),
    show_banner_alerts: ko.observable(true),
    showInfoButton: ko.observable(false),
    settings_usernames: ko.observable(),
    settings_passwords: ko.observable(),
    settings_credentials: ko.observable(),
    settings_http_headers: ko.observable(),
    settings_otp_secret: ko.observable(),
    errorCount: 0,
    domain() {
        if (this.inputDomain()?.length > 0) {
            let cleanDomain = this.inputDomain().toLowerCase().trim()
            if (cleanDomain.indexOf('.co.uk') === -1) {
                let filterDomain = cleanDomain.match(/[^.]*\.[^.]{2,12}$/)
                if (filterDomain?.length > 0) {
                    cleanDomain = filterDomain[0]
                }
            }
            return cleanDomain.toLowerCase().trim().replace(/\s+/g, "").replace("www.", "");
        }
    },
    email() {
        return this.inputEmail().toLowerCase().trim().replace(/\s+/g, "");
    },
    emailPlaceholder() {
        let domain = this.domain()
        if (!domain) {
            domain = this.t('domain_placeholder')
        }
        return "email@" + domain;
    },
    insertDomain() {
        let getDomain = this.email()
        let domainFromEmail = getDomain.split("@")[1];
        this.inputDomain(domainFromEmail);
    },
    filterHosts() {
        let hosts = []
        for (let item of this.hosts()) {
            // filter hostnames
            if (JSON.stringify(item).toLowerCase().indexOf(this.inputSearchHosts().toLowerCase()) >= 0) {
                if (hosts.length < 100) {
                    hosts.push(item);
                }
            }
        }
        // dont use filter
        if (this.inputSearchHosts().length == 0) {
            this.filteredHosts(this.hosts().slice(0, 100))
        } else {
            this.filteredHosts(hosts);
        }
    },
    filterLeaks() {
        let leaks = this.leaks()
        this.filteredLeaks(leaks.slice(0, 20))
    },
    api() {
        if (window.location.host == "localhost:8081") {
            return "http://localhost:8080/";
        } else {
            return "https://api.hackerattack.de/";
        }
    },
    statusInHistory(status) {
        return this.data() && this.data()?.script_status && this.data()?.script_status.indexOf(status) >= 0;
    },
    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    async init() {
        // redirect to www if not localhost testing
        if (window.location.host != "localhost:8081"
            && !window.location.host.startsWith("www")) {
            window.location = "https://www." + window.location.host
            return;
        }

        // get browser language
        let userLang = navigator.language || navigator.userLanguage
        if (sessionStorage.getItem("language")) {
            this.setLanguage(sessionStorage.getItem("language"))
        } else {
            this.setLanguage(userLang.slice(0, 2))
            this.saveLanguageIfLoggedIn()
        }

        // open example
        if (document.location.hash == "#example") {
            this.showExample()
            return;
        }

        if (document.location.hash == "#render") {
            this.renderJSON()
            return;
        }

        // check token
        if (document.cookie.indexOf("token") >= 0) {
            await this.checkUserStatus()
            this.inputDomain(this.info().hostname)
            this.checkReport()
        }

        // load animation gif if window size is high
        if (window.innerWidth > 1060) {
            let animation = document.querySelector('#load-laptop')
            if (animation) {
                animation.src = "/img/laptop.gif"
                animation.style.display = "initial"
            }
        }

        // request stats
        let stats = await this.getServerStats()
        this.serverStats(stats)
        this.feed_zeroday(stats["0day"])
        this.feed_cyberattack(stats["cyberattack"])
        this.totalprice_monthly(stats.costs_monthly)
        this.totalprice_weekly(stats.costs_weekly)

        // init bubble text
        this.scanInfo(this.t("status_free_scan"))

        // redirect to front page if not logged in
        if (document.location.pathname == "/settings.html" && !this.info()?.hostname) {
            document.location = "/"
        }
    },
    async checkReport(url) {
        if (this.domain().length <= 2) {
            return;
        }
        if (document.cookie.indexOf("token") == -1) {
            return;
        }

        // get results from API
        let result = await this.getReport(url)

        // set data and controller
        if (result?.hosts) {
            this.setNewData(result)
        }

        // api returns an error
        if (result.status && result.status == "error") {
            return;
        }

        // scan was done
        if (result.status && result.status == "done") {
            return;
        }

        // check every 30 seconds
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
            this.checkReport(url)
        }, 60 * 1000)
    },
    setNewData(result) {
        // set render objects
        if (result.hosts) {
            this.hosts(result.hosts)
            this.alerts(result.alerts)
            this.known_exploits(result.known_exploits)
            this.leaks(result.leaks)
            this.technology(result.technology)
            this.stats(result.stats)
            this.scanStatus(result.script_status)
            this.summary(result.summary)
            this.data(result)
        } else {
            this.hosts([])
            this.alerts([])
            this.known_exploits([])
            this.leaks([])
            this.technology([])
            this.scanStatus("")
            this.stats([])
            this.summary("")
            this.data([])
        }

        // activate host filter
        this.filterHosts()
        this.filterLeaks()

        // update status
        if (this.data() && this.data()?.readable_status) {
            this.scanInfo(this.t("status_" + this.data().readable_status))
        }

        // subdomains infos for loading text
        if (this.data() && this.data()?.stats) {
            this.subdomains(this.data()?.stats?.subdomains)
        }

        // host is not connectable
        if (result.status && result.status == "invalid") {
            this.showMessage(this.t("host_invalid"))
            if (this.timer) {
                clearTimeout(this.timer)
            }
            return;
        }
    },
    async checkUserStatus() {
        if (document.cookie.indexOf("token") >= 0) {
            // check user api
            let userInfos = await this.getUserInfo()
            this.info(userInfos)
            this.projects(this.info()?.projects || [])
            this.inputDomain(this.info()?.hostname || this.inputDomain())
            this.company_name(this.info()?.address?.company_name || "")
            this.firstname(this.info()?.address?.firstname || "")
            this.lastname(this.info()?.address?.lastname || "")
            this.street_and_number(this.info()?.address?.street_and_number || "")
            this.zip_code(this.info()?.address?.zip_code || "")
            this.location(this.info()?.address?.location || "")
            this.country(this.info()?.address?.country || "")
            this.iban(this.info()?.address?.iban || "")
            this.has_flatrate(this.info()?.has_flatrate || false)
            this.notification(this.info()?.notification)
            this.show_banner_alerts(this.info()?.show_banner_alerts || true)
            let json_reports = this.info()?.reports_json || []
            json_reports.sort((a, b) => {
                const numA = Number((a.match(/\d+/) || ["0"])[0]);
                const numB = Number((b.match(/\d+/) || ["0"])[0]);
                return numA - numB;
            }).reverse();
            this.availableReportsJSON([this.t('option_current_scan')].concat(json_reports))
            let download_reports = (this.info()?.reports_pdf || []).concat(this.info()?.reports_json || []) || []
            download_reports.sort((a, b) => {
                const numA = Number((a.match(/\d+/) || ["0"])[0]);
                const numB = Number((b.match(/\d+/) || ["0"])[0]);
                return numA - numB;
            }).reverse();
            this.availableReports([this.t('option_select_download')].concat(download_reports))

            // set language form user
            if (this.info().language) {
                this.language(this.info().language)
            }

            // token not valid -> logout
            if (this.info().status == "error") {
                this.logout()
            }

            // show payment methods
            if (this.info().did_pay) {
                this.checkPaymentMethods()
            }

            if (this.info().status) {
                return true;
            }
        }
        return true;
    },
    async startVerification() {
        if (this.email().length > 0) {
            // add mail icon
            let mailIcon = document.querySelector("#mail-icon")
            if (mailIcon) {
                mailIcon.remove()
            }
            document.querySelector(".verification-button").insertAdjacentHTML("beforeend",
                '<svg id="mail-icon" alt="loading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M128.4 239.8L320 97.9L511.6 239.8L353.5 357C343.8 364.2 332.1 368 320 368C307.9 368 296.2 364.1 286.5 357L128.4 239.8zM320 32C307.9 32 296.2 35.9 286.5 43L89.9 188.7C73.6 200.8 64 219.8 64 240.1L64 480C64 515.3 92.7 544 128 544L512 544C547.3 544 576 515.3 576 480L576 240.1C576 219.8 566.4 200.7 550.1 188.7L353.5 43C343.8 35.8 332.1 32 320 32z"/></svg>')

            // request here :)
            await this.postVerification()

            // switch back to unread icon
            document.querySelector("#mail-icon").outerHTML = '<svg id="mail-icon" alt="loading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M48 64c-26.5 0-48 21.5-48 48 0 15.1 7.1 29.3 19.2 38.4l208 156c17.1 12.8 40.5 12.8 57.6 0l208-156c12.1-9.1 19.2-23.3 19.2-38.4 0-26.5-21.5-48-48-48L48 64zM0 196L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-188-198.4 148.8c-34.1 25.6-81.1 25.6-115.2 0L0 196z"/></svg>'
        } else {
            this.showMessage(this.t('error_email_domain'))
        }
    },
    async startPayment(timing) {
        // domain and email is missing
        if (!this.info() || !this.info().email) {
            return;
        }
        let jsonData = await this.getPayMentRedirectUrl(timing)
        if (jsonData.redirect) {
            window.location = jsonData.redirect
        } else {
            if (jsonData.message) {
                this.showMessage(jsonData.message)
            } else {
                this.showMessage(this.t('payment_error'))
            }
        }
    },
    async startCancelPayment() {
        if (confirm(this.t('confirm_cancel_payment'))) {
            if (this.info().sub == true) {
                await this.cancelPayment()
                this.checkUserStatus()
            } else {
                return false;
            }
        }
    },
    async startRemoveAccount() {
        if (confirm(this.t('confirm_remove_account'))) {
            await this.removeAccount()
            setTimeout(() => {
                this.logout()
            }, 3000)
        }
    },
    async startProjectScan() {
        await this.saveProjects()
        const response = await fetch(
            `${this.api()}security/flatrate`,
            { credentials: 'include' })
        const jsonData = await response.json()
        if (jsonData.message) {
            this.showMessage(jsonData.message)
            setTimeout(() => {
                window.location = "/reports.html"
            }, 1000)
        }
    },
    async abortScan() {
        if (confirm(this.t('confirm_abort_scan'))) {
            const response = await fetch(
                `${this.api()}security/abort`,
                { credentials: 'include' })
            const jsonData = await response.json()
            if (jsonData.message) {
                this.showMessage(jsonData.message)
                setTimeout(() => {
                    window.location = "/reports.html"
                }, 1000)
            }
        }
    },
    async stopScan() {
        if (confirm(this.t('confirm_stop_scan'))) {
            const response = await fetch(
                `${this.api()}security/stop`,
                { credentials: 'include' })
            const jsonData = await response.json()
            if (jsonData.message) {
                this.showMessage(jsonData.message)
                setTimeout(() => {
                    window.location = "/reports.html"
                }, 1000)
            }
        }
    },
    switchOption(option) {
        if (option == "notification") {
            this.saveOption("notification", this.notification())
        } else if (option == "newsletter") {
            this.saveOption("newsletter", this.newsletter())
        } else if (option == "banner_alerts") {
            this.saveOption("show_banner_alerts", this.show_banner_alerts())
        }
    },
    newProject() {
        this.projects.push([])
    },
    toggleDivs(button_class, content_index) {
        document.querySelectorAll('.' + button_class).forEach(button => {
            button.classList.remove('active');
        })
        document.querySelectorAll('.' + button_class + '-' + content_index).forEach(button => {
            button.classList.add('active');
        })
        document.querySelectorAll('.' + button_class + '-content').forEach(content => {
            content.classList.add('hide')
        })
        document.querySelectorAll('.' + button_class + '-content-' + content_index).forEach(content => {
            content.classList.remove('hide')
        })
    },
    async saveProjects() {
        // send full projects settings to api
        let result = await this.saveRequestProject()
        if (result) {
            this.checkUserStatus()
        }
    },
    async requestProject(id) {
        const response = await fetch(
            `${this.api()}project/${this.domain()}/${filename}`,
            { credentials: 'include' })
        const jsonData = await response.json()
        if (jsonData.message) {
            this.showMessage(jsonData.message)
        }
        return jsonData;
    },
    clean_project_list(projects) {
        // this will flat the multiarray list
        // if hostnames are comma separated
        let new_projects_list = JSON.parse(JSON.stringify(projects));
        for (let project_index = 0; project_index < projects.length; project_index++) {
            let project = projects[project_index]
            // remove empty projects
            if (project.length == 0) {
                new_projects_list.pop(project_index)
            } else {
                for (let index = 0; index < project.length; index++) {
                    let hostname = project[index]
                    // split hostnames with comma
                    if (hostname.indexOf(',') >= 0) {
                        let array_hostnames = hostname.split(",")
                        for (let host_index = 0; host_index < array_hostnames.length; host_index++) {
                            let arr_hostname = array_hostnames[host_index]
                            // override hostame with comma and add all other comma values
                            if (host_index == 0) {
                                new_projects_list[project_index][index] = arr_hostname.trim()
                            } else {
                                new_projects_list[project_index].push(arr_hostname.trim())
                            }
                        }
                    }
                }
            }
        }
        return new_projects_list;
    },
    async saveRequestProject() {
        let data = {
            "projects": this.clean_project_list(this.projects())
        }

        const response = await fetch(
            `${this.api()}projects/update/projects`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const jsonData = await response.json()
        if (jsonData.message) {
            this.showMessage(jsonData.message)
        }
        if (jsonData.status == "error") {
            return false;
        } else {
            return true;
        }
    },
    async selectJSONReport() {
        let input_filename = document.querySelector('#reportJSON').value
        if (input_filename.indexOf('.') >= 0) {
            // stop other requests
            if (this.timer) {
                clearTimeout(this.timer)
            }
            let result = await this.requestReport(input_filename)
            // set data and controller
            this.setNewData(result)
        } else {
            // show current scan
            this.checkReport()
        }
    },
    async requestReport(projectFilename) {
        const response = await fetch(
            `${this.api()}security/download/${projectFilename}`,
            { credentials: 'include' })
        const jsonData = await response.json()
        if (jsonData.message) {
            this.showMessage(jsonData.message)
        }
        return jsonData;
    },
    downloadReport() {
        let filename = document.querySelector('#reportDOWNLOAD').value
        if (filename.indexOf('.') >= 1) {
            const url = `${this.api()}security/download/${filename}`
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    },
    selectDownloadReport() {
        let filename = document.querySelector('#reportDOWNLOAD').value
        if (filename.indexOf('.') >= 1) {
            let url = `${this.api()}security/download/${filename}`
            this.downloadThisReport(url)
        }
    },
    async showExample() {
        // stop other requests
        if (this.timer) {
            clearTimeout(this.timer)
        }
        let result = await this.getExample();
        this.setNewData(result)
    },
    async renderJSON() {
        // stop other requests
        if (this.timer) {
            clearTimeout(this.timer)
        }
        // Komprimierte Daten aus sessionStorage abrufen
        const compressedData = window.sessionStorage.getItem('json_data');
        if (compressedData) {
            const jsonData = await this.decompressData(compressedData);
            try {
                const parsedData = JSON.parse(jsonData);
                this.setNewData(parsedData);
            } catch (error) {
                console.error("Failed to parse JSON data:", error);
            }
        }
    },
    async decompressData(compressedData) {
        const compressedBytes = Uint8Array.from(atob(compressedData), c => c.charCodeAt(0));
        const compressedBlob = new Blob([compressedBytes]);
        const ds = new DecompressionStream('gzip');
        const decompressedStream = compressedBlob.stream().pipeThrough(ds);
        const reader = decompressedStream.getReader();
        const chunks = [];
        let result;

        while (!(result = await reader.read()).done) {
            chunks.push(result.value);
        }

        const decompressedArray = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.byteLength, 0));
        let offset = 0;
        for (const chunk of chunks) {
            decompressedArray.set(new Uint8Array(chunk), offset);
            offset += chunk.byteLength;
        }

        const decoder = new TextDecoder();
        return decoder.decode(decompressedArray.buffer);
    },
    async getExample() {
        let response = await fetch(`${this.api()}security/example`)
            .catch(() => {
                this.showMessage(this.t('api_error'))
            })
        let jsonData = await response.json()
        if (jsonData.message) {
            this.showMessage(jsonData.message)
        }
        return jsonData;
    },
    async getReport(input_url) {
        let url = `${this.api()}security/scan`
        if (input_url) {
            url = input_url
        }

        let response = await fetch(url,
            { credentials: 'include' })
            .catch(() => {
                this.showMessage(this.t('api_error'))
            })
        let jsonData = await response.json()
        if (jsonData.message) {
            this.showMessage(jsonData.message)
        }
        return jsonData;
    },
    async getServerStats() {
        let response = await fetch(`${this.api()}stats`)
        let jsonData = await response.json()
        return jsonData;
    },
    async postVerification() {
        const response = await fetch(`${this.api()}email/verify`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.email(),
                hostname: this.domain()
            })
        })
        const jsonData = await response.json()
        if (jsonData.status == "error") {
            if (this.errorCount < 3) {
                setTimeout(() => {
                    this.postVerification();
                }, this.errorCount * 500)
            }
            this.errorCount += 1
        }
        if (jsonData.message) {
            this.showMessage(jsonData.message)
        }
        return jsonData;
    },
    async saveAddress() {
        const response = await fetch(`${this.api()}address`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                company_name: this.company_name(),
                firstname: this.firstname(),
                lastname: this.lastname(),
                street_and_number: this.street_and_number(),
                zip_code: this.zip_code(),
                location: this.location(),
                country: this.country(),
                iban: this.iban()
            })
        }).catch(() => {
            this.showMessage(this.t('api_error'))
        })
        const jsonData = await response.json()
        if (jsonData.message) {
            this.showMessage(jsonData.message)
        }
        if (jsonData.detail) {
            this.showMessage(jsonData.detail[0].msg)
        }
        return jsonData;
    },
    async saveOption(endpoint, bool) {
        const response = await fetch(`${this.api()}${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                option: bool
            })
        }).catch(() => {
            this.showMessage(this.t('api_error'))
        })
        const jsonData = await response.json()
        return jsonData;
    },
    async saveSettings() {
        const response = await fetch(`${this.api()}settings/scan`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                custom_usernames: this.getList(this.settings_usernames()),
                custom_passwords: this.getList(this.settings_passwords()),
                custom_credentials: this.getList(this.settings_credentials()),
                custom_http_headers: this.getList(this.settings_http_headers()),
                custom_otp_secret: this.settings_otp_secret()
            })
        }).catch(() => {
            this.showMessage(this.t('api_error'))
        })
        const jsonData = await response.json()
        if (jsonData.message) {
            this.showMessage(jsonData.message)
        }
        if (jsonData.detail) {
            this.showMessage(jsonData.detail[0].msg)
        }
        return jsonData;
    },
    async saveLanguage() {
        const response = await fetch(`${this.api()}language`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "language": this.language()
            })
        }).catch(() => {
            this.showMessage(this.t('api_error'))
        })
        const jsonData = await response.json()
        return jsonData;
    },
    async getPayMentRedirectUrl(timing) {
        let response = await fetch(`${this.api()}payment/${this.domain()}/${timing}`,
            { credentials: 'include' })
        let jsonData = response.json()
        if (jsonData.message) {
            this.showMessage(jsonData.message)
        }
        return jsonData;
    },
    async cancelPayment() {
        let response = await fetch(`${this.api()}cancel`,
            { credentials: 'include' })
        let jsonData = response.json()
        if (jsonData.message) {
            this.showMessage(jsonData.message)
            window.location.reload()
        }
        return jsonData;
    },
    async removeAccount() {
        let response = await fetch(`${this.api()}remove/user`,
            { method: 'POST', credentials: 'include' })
        let jsonData = response.json()
        if (jsonData.message) {
            this.showMessage(jsonData.message)
        }
    },
    async getUserInfo() {
        const response = await fetch(
            `${this.api()}info`,
            { credentials: 'include' })
        const jsonData = await response.json()
        if (jsonData.message) {
            this.showMessage(jsonData.message)
        }
        return jsonData;
    },
    async deletePaymentMethod(payment_id) {
        if (!confirm(this.t('confirm_main'))) {
            return
        }
        let response = await fetch(`${this.api()}remove/payment/${payment_id}`,
            { credentials: 'include' })
        let jsonData = await response.json()
        if (jsonData.message) {
            this.showMessage(jsonData.message)
        }
        this.checkPaymentMethods()
    },
    async checkPaymentMethods() {
        let response = await fetch(`${this.api()}methods/payment`,
            { credentials: 'include' })
        let jsonData = await response.json()
        if (jsonData.message) {
            this.showMessage(jsonData.message)
            return;
        }
        this.payment_methods(jsonData.payment_methods)
    },
    joinProjects(projects) {
        return projects.join("\n");
    },
    bindProject(index) {
        let projects = document.querySelectorAll('.textarea-projects')
        try {
            let value = projects[index].value
            let new_list = this.projects()
            new_list[index] = value.split("\n")
            this.projects(new_list)
            return value.split("\n");
        } catch (error) {
            console.log(error)
        }
    },
    showMessage(message) {
        this.message(message)
        setTimeout(() => {
            this.message("")
        }, 15 * 1000)
    },
    isActiveStatusClass(status) {
        if (this.statusInHistory(status + "_done")) {
            return "status_done";
        } else {
            return "";
        }
    },
    isInURL(keyword) {
        if (document.location.pathname.indexOf(keyword) >= 0) {
            return true;
        }
        return false;
    },
    isStatusPending(status) {
        if (!this.statusInHistory(status) && !this.statusInHistory(status + "_done")) {
            return true;
        }
        return false;
    },
    isStatusRunning(status) {
        if (this.statusInHistory(status) && !this.statusInHistory(status + "_done")) {
            return true;
        }
        return false;
    },
    isStatusDone(status) {
        if (this.statusInHistory(status + "_done")) {
            return true;
        }
        return false;
    },
    isPaid() {
        if (this.info().payment) {
            return true;
        } else {
            return false;
        }
    },
    getTechFromDict(list) {
        let result = []
        for (let item of list) {
            result.push(item.product)
        }
        return result;
    },
    getList(list_string) {
        if (list_string) {
            let splitted = list_string.replace(/ /g, '').split(/,|\n/)
            return splitted.filter(item => item.trim() !== "");
        }
        return list_string;
    },
    setLanguage(language) {
        if (language == "de" || language == "en") {
            sessionStorage.setItem("language", language)
            document.cookie = `language=${language}; domain=.hackerattack.de; path=/; SameSite=Lax`;
            document.cookie = `language=${language}; domain=localhost; path=/; SameSite=Lax`;
            this.language(language)
            this.saveLanguageIfLoggedIn()
        }
    },
    saveLanguageIfLoggedIn() {
        if (this.info()) {
            this.saveLanguage()
        }
    },
    logout() {
        document.cookie = "token=DELETE; domain=.hackerattack.de; path=/; max-age=1"
        document.cookie = "token=DELETE; domain=localhost; path=/; max-age=1"
        setTimeout(() => {
            window.location = "/"
        }, 1100)
    },
    linkCVEDetails(cve) {
        return "https://nvd.nist.gov/vuln/detail/" + cve
    },
    all_hosts() {
        if (this.serverStats()?.all_hosts) {
            let num = parseInt(this.serverStats()?.all_hosts)
            return num.toLocaleString();
        } else {
            return "?";
        }
    },
    all_alerts() {
        if (this.serverStats()?.all_alerts) {
            let num = parseInt(this.serverStats()?.all_alerts)
            return num.toLocaleString();
        } else {
            return "?";
        }
    },
    all_users() {
        if (this.serverStats()?.all_users) {
            let num = parseInt(this.serverStats()?.all_users)
            return num.toLocaleString();
        } else {
            return "?";
        }
    },
    changeDomain() {
        let url = `${this.api()}security/force/${this.domain()}`
        this.setNewData({})
        this.checkReport(url)
    },
    jumpToReport() {
        document.querySelector('.loading').scrollIntoView()
    },
    t(value) {
        return translations(value, this.language())
    },
};

ko.applyBindings(appModel);
appModel.init()