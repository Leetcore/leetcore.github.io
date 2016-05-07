// Created with Squiffy 5.1.0
// https://github.com/textadventures/squiffy

(function(){
/* jshint quotmark: single */
/* jshint evil: true */

var squiffy = {};

(function () {
    'use strict';

    squiffy.story = {};

    var initLinkHandler = function () {
        var handleLink = function (link) {
            if (link.hasClass('disabled')) return;
            var passage = link.data('passage');
            var section = link.data('section');
            var rotateAttr = link.attr('data-rotate');
            var sequenceAttr = link.attr('data-sequence');
            if (passage) {
                disableLink(link);
                squiffy.set('_turncount', squiffy.get('_turncount') + 1);
                passage = processLink(passage);
                if (passage) {
                    currentSection.append('<hr/>');
                    squiffy.story.passage(passage);
                }
                var turnPassage = '@' + squiffy.get('_turncount');
                if (turnPassage in squiffy.story.section.passages) {
                    squiffy.story.passage(turnPassage);
                }
                if ('@last' in squiffy.story.section.passages && squiffy.get('_turncount')>= squiffy.story.section.passageCount) {
                    squiffy.story.passage('@last');
                }
            }
            else if (section) {
                currentSection.append('<hr/>');
                disableLink(link);
                section = processLink(section);
                squiffy.story.go(section);
            }
            else if (rotateAttr || sequenceAttr) {
                var result = rotate(rotateAttr || sequenceAttr, rotateAttr ? link.text() : '');
                link.html(result[0].replace(/&quot;/g, '"').replace(/&#39;/g, '\''));
                var dataAttribute = rotateAttr ? 'data-rotate' : 'data-sequence';
                link.attr(dataAttribute, result[1]);
                if (!result[1]) {
                    disableLink(link);
                }
                if (link.attr('data-attribute')) {
                    squiffy.set(link.attr('data-attribute'), result[0]);
                }
                squiffy.story.save();
            }
        };

        squiffy.ui.output.on('click', 'a.squiffy-link', function () {
            handleLink(jQuery(this));
        });

        squiffy.ui.output.on('keypress', 'a.squiffy-link', function (e) {
            if (e.which !== 13) return;
            handleLink(jQuery(this));
        });

        squiffy.ui.output.on('mousedown', 'a.squiffy-link', function (event) {
            event.preventDefault();
        });
    };

    var disableLink = function (link) {
        link.addClass('disabled');
        link.attr('tabindex', -1);
    }
    
    squiffy.story.begin = function () {
        if (!squiffy.story.load()) {
            squiffy.story.go(squiffy.story.start);
        }
    };

    var processLink = function(link) {
        var sections = link.split(',');
        var first = true;
        var target = null;
        sections.forEach(function (section) {
            section = section.trim();
            if (startsWith(section, '@replace ')) {
                replaceLabel(section.substring(9));
            }
            else {
                if (first) {
                    target = section;
                }
                else {
                    setAttribute(section);
                }
            }
            first = false;
        });
        return target;
    };

    var setAttribute = function(expr) {
        var lhs, rhs, op, value;
        var setRegex = /^([\w]*)\s*=\s*(.*)$/;
        var setMatch = setRegex.exec(expr);
        if (setMatch) {
            lhs = setMatch[1];
            rhs = setMatch[2];
            if (isNaN(rhs)) {
                squiffy.set(lhs, rhs);
            }
            else {
                squiffy.set(lhs, parseFloat(rhs));
            }
        }
        else {
            var incDecRegex = /^([\w]*)\s*([\+\-])=\s*(.*)$/;
            var incDecMatch = incDecRegex.exec(expr);
            if (incDecMatch) {
                lhs = incDecMatch[1];
                op = incDecMatch[2];
                rhs = parseFloat(incDecMatch[3]);
                value = squiffy.get(lhs);
                if (value === null) value = 0;
                if (op == '+') {
                    value += rhs;
                }
                if (op == '-') {
                    value -= rhs;
                }
                squiffy.set(lhs, value);
            }
            else {
                value = true;
                if (startsWith(expr, 'not ')) {
                    expr = expr.substring(4);
                    value = false;
                }
                squiffy.set(expr, value);
            }
        }
    };

    var replaceLabel = function(expr) {
        var regex = /^([\w]*)\s*=\s*(.*)$/;
        var match = regex.exec(expr);
        if (!match) return;
        var label = match[1];
        var text = match[2];
        if (text in squiffy.story.section.passages) {
            text = squiffy.story.section.passages[text].text;
        }
        else if (text in squiffy.story.sections) {
            text = squiffy.story.sections[text].text;
        }
        var stripParags = /^<p>(.*)<\/p>$/;
        var stripParagsMatch = stripParags.exec(text);
        if (stripParagsMatch) {
            text = stripParagsMatch[1];
        }
        var $labels = squiffy.ui.output.find('.squiffy-label-' + label);
        $labels.fadeOut(1000, function() {
            $labels.html(squiffy.ui.processText(text));
            $labels.fadeIn(1000, function() {
                squiffy.story.save();
            });
        });
    };

    squiffy.story.go = function(section) {
        squiffy.set('_transition', null);
        newSection();
        squiffy.story.section = squiffy.story.sections[section];
        if (!squiffy.story.section) return;
        squiffy.set('_section', section);
        setSeen(section);
        var master = squiffy.story.sections[''];
        if (master) {
            squiffy.story.run(master);
            squiffy.ui.write(master.text);
        }
        squiffy.story.run(squiffy.story.section);
        // The JS might have changed which section we're in
        if (squiffy.get('_section') == section) {
            squiffy.set('_turncount', 0);
            squiffy.ui.write(squiffy.story.section.text);
            squiffy.story.save();
        }
    };

    squiffy.story.run = function(section) {
        if (section.clear) {
            squiffy.ui.clearScreen();
        }
        if (section.attributes) {
            processAttributes(section.attributes);
        }
        if (section.js) {
            section.js();
        }
    };

    squiffy.story.passage = function(passageName) {
        var passage = squiffy.story.section.passages[passageName];
        if (!passage) return;
        setSeen(passageName);
        var masterSection = squiffy.story.sections[''];
        if (masterSection) {
            var masterPassage = masterSection.passages[''];
            if (masterPassage) {
                squiffy.story.run(masterPassage);
                squiffy.ui.write(masterPassage.text);
            }
        }
        var master = squiffy.story.section.passages[''];
        if (master) {
            squiffy.story.run(master);
            squiffy.ui.write(master.text);
        }
        squiffy.story.run(passage);
        squiffy.ui.write(passage.text);
        squiffy.story.save();
    };

    var processAttributes = function(attributes) {
        attributes.forEach(function (attribute) {
            if (startsWith(attribute, '@replace ')) {
                replaceLabel(attribute.substring(9));
            }
            else {
                setAttribute(attribute);
            }
        });
    };

    squiffy.story.restart = function() {
        if (squiffy.ui.settings.persist && window.localStorage) {
            var keys = Object.keys(localStorage);
            jQuery.each(keys, function (idx, key) {
                if (startsWith(key, squiffy.story.id)) {
                    localStorage.removeItem(key);
                }
            });
        }
        else {
            squiffy.storageFallback = {};
        }
        if (squiffy.ui.settings.scroll === 'element') {
            squiffy.ui.output.html('');
            squiffy.story.begin();
        }
        else {
            location.reload();
        }
    };

    squiffy.story.save = function() {
        squiffy.set('_output', squiffy.ui.output.html());
    };

    squiffy.story.load = function() {
        var output = squiffy.get('_output');
        if (!output) return false;
        squiffy.ui.output.html(output);
        currentSection = jQuery('#' + squiffy.get('_output-section'));
        squiffy.story.section = squiffy.story.sections[squiffy.get('_section')];
        var transition = squiffy.get('_transition');
        if (transition) {
            eval('(' + transition + ')()');
        }
        return true;
    };

    var setSeen = function(sectionName) {
        var seenSections = squiffy.get('_seen_sections');
        if (!seenSections) seenSections = [];
        if (seenSections.indexOf(sectionName) == -1) {
            seenSections.push(sectionName);
            squiffy.set('_seen_sections', seenSections);
        }
    };

    squiffy.story.seen = function(sectionName) {
        var seenSections = squiffy.get('_seen_sections');
        if (!seenSections) return false;
        return (seenSections.indexOf(sectionName) > -1);
    };
    
    squiffy.ui = {};

    var currentSection = null;
    var screenIsClear = true;
    var scrollPosition = 0;

    var newSection = function() {
        if (currentSection) {
            disableLink(jQuery('.squiffy-link', currentSection));
        }
        var sectionCount = squiffy.get('_section-count') + 1;
        squiffy.set('_section-count', sectionCount);
        var id = 'squiffy-section-' + sectionCount;
        currentSection = jQuery('<div/>', {
            id: id,
        }).appendTo(squiffy.ui.output);
        squiffy.set('_output-section', id);
    };

    squiffy.ui.write = function(text) {
        screenIsClear = false;
        scrollPosition = squiffy.ui.output.height();
        currentSection.append(jQuery('<div/>').html(squiffy.ui.processText(text)));
        squiffy.ui.scrollToEnd();
    };

    squiffy.ui.clearScreen = function() {
        squiffy.ui.output.html('');
        screenIsClear = true;
        newSection();
    };

    squiffy.ui.scrollToEnd = function() {
        var scrollTo, currentScrollTop, distance, duration;
        if (squiffy.ui.settings.scroll === 'element') {
            scrollTo = squiffy.ui.output[0].scrollHeight - squiffy.ui.output.height();
            currentScrollTop = squiffy.ui.output.scrollTop();
            if (scrollTo > currentScrollTop) {
                distance = scrollTo - currentScrollTop;
                duration = distance / 0.4;
                squiffy.ui.output.stop().animate({ scrollTop: scrollTo }, duration);
            }
        }
        else {
            scrollTo = scrollPosition;
            currentScrollTop = Math.max(jQuery('body').scrollTop(), jQuery('html').scrollTop());
            if (scrollTo > currentScrollTop) {
                var maxScrollTop = jQuery(document).height() - jQuery(window).height();
                if (scrollTo > maxScrollTop) scrollTo = maxScrollTop;
                distance = scrollTo - currentScrollTop;
                duration = distance / 0.5;
                jQuery('body,html').stop().animate({ scrollTop: scrollTo }, duration);
            }
        }
    };

    squiffy.ui.processText = function(text) {
        function process(text, data) {
            var containsUnprocessedSection = false;
            var open = text.indexOf('{');
            var close;
            
            if (open > -1) {
                var nestCount = 1;
                var searchStart = open + 1;
                var finished = false;
             
                while (!finished) {
                    var nextOpen = text.indexOf('{', searchStart);
                    var nextClose = text.indexOf('}', searchStart);
         
                    if (nextClose > -1) {
                        if (nextOpen > -1 && nextOpen < nextClose) {
                            nestCount++;
                            searchStart = nextOpen + 1;
                        }
                        else {
                            nestCount--;
                            searchStart = nextClose + 1;
                            if (nestCount === 0) {
                                close = nextClose;
                                containsUnprocessedSection = true;
                                finished = true;
                            }
                        }
                    }
                    else {
                        finished = true;
                    }
                }
            }
            
            if (containsUnprocessedSection) {
                var section = text.substring(open + 1, close);
                var value = processTextCommand(section, data);
                text = text.substring(0, open) + value + process(text.substring(close + 1), data);
            }
            
            return (text);
        }

        function processTextCommand(text, data) {
            if (startsWith(text, 'if ')) {
                return processTextCommand_If(text, data);
            }
            else if (startsWith(text, 'else:')) {
                return processTextCommand_Else(text, data);
            }
            else if (startsWith(text, 'label:')) {
                return processTextCommand_Label(text, data);
            }
            else if (/^rotate[: ]/.test(text)) {
                return processTextCommand_Rotate('rotate', text, data);
            }
            else if (/^sequence[: ]/.test(text)) {
                return processTextCommand_Rotate('sequence', text, data);   
            }
            else if (text in squiffy.story.section.passages) {
                return process(squiffy.story.section.passages[text].text, data);
            }
            else if (text in squiffy.story.sections) {
                return process(squiffy.story.sections[text].text, data);
            }
            return squiffy.get(text);
        }

        function processTextCommand_If(section, data) {
            var command = section.substring(3);
            var colon = command.indexOf(':');
            if (colon == -1) {
                return ('{if ' + command + '}');
            }

            var text = command.substring(colon + 1);
            var condition = command.substring(0, colon);

            var operatorRegex = /([\w ]*)(=|&lt;=|&gt;=|&lt;&gt;|&lt;|&gt;)(.*)/;
            var match = operatorRegex.exec(condition);

            var result = false;

            if (match) {
                var lhs = squiffy.get(match[1]);
                var op = match[2];
                var rhs = match[3];

                if (op == '=' && lhs == rhs) result = true;
                if (op == '&lt;&gt;' && lhs != rhs) result = true;
                if (op == '&gt;' && lhs > rhs) result = true;
                if (op == '&lt;' && lhs < rhs) result = true;
                if (op == '&gt;=' && lhs >= rhs) result = true;
                if (op == '&lt;=' && lhs <= rhs) result = true;
            }
            else {
                var checkValue = true;
                if (startsWith(condition, 'not ')) {
                    condition = condition.substring(4);
                    checkValue = false;
                }

                if (startsWith(condition, 'seen ')) {
                    result = (squiffy.story.seen(condition.substring(5)) == checkValue);
                }
                else {
                    var value = squiffy.get(condition);
                    if (value === null) value = false;
                    result = (value == checkValue);
                }
            }

            var textResult = result ? process(text, data) : '';

            data.lastIf = result;
            return textResult;
        }

        function processTextCommand_Else(section, data) {
            if (!('lastIf' in data) || data.lastIf) return '';
            var text = section.substring(5);
            return process(text, data);
        }

        function processTextCommand_Label(section, data) {
            var command = section.substring(6);
            var eq = command.indexOf('=');
            if (eq == -1) {
                return ('{label:' + command + '}');
            }

            var text = command.substring(eq + 1);
            var label = command.substring(0, eq);

            return '<span class="squiffy-label-' + label + '">' + process(text, data) + '</span>';
        }

        function processTextCommand_Rotate(type, section, data) {
            var options;
            var attribute = '';
            if (section.substring(type.length, type.length + 1) == ' ') {
                var colon = section.indexOf(':');
                if (colon == -1) {
                    return '{' + section + '}';
                }
                options = section.substring(colon + 1);
                attribute = section.substring(type.length + 1, colon);
            }
            else {
                options = section.substring(type.length + 1);
            }
            var rotation = rotate(options.replace(/"/g, '&quot;').replace(/'/g, '&#39;'));
            if (attribute) {
                squiffy.set(attribute, rotation[0]);
            }
            return '<a class="squiffy-link" data-' + type + '="' + rotation[1] + '" data-attribute="' + attribute + '" role="link">' + rotation[0] + '</a>';
        }

        var data = {
            fulltext: text
        };
        return process(text, data);
    };

    squiffy.ui.transition = function(f) {
        squiffy.set('_transition', f.toString());
        f();
    };

    squiffy.storageFallback = {};

    squiffy.set = function(attribute, value) {
        if (typeof value === 'undefined') value = true;
        if (squiffy.ui.settings.persist && window.localStorage) {
            localStorage[squiffy.story.id + '-' + attribute] = JSON.stringify(value);
        }
        else {
            squiffy.storageFallback[attribute] = JSON.stringify(value);
        }
        squiffy.ui.settings.onSet(attribute, value);
    };

    squiffy.get = function(attribute) {
        var result;
        if (squiffy.ui.settings.persist && window.localStorage) {
            result = localStorage[squiffy.story.id + '-' + attribute];
        }
        else {
            result = squiffy.storageFallback[attribute];
        }
        if (!result) return null;
        return JSON.parse(result);
    };

    var startsWith = function(string, prefix) {
        return string.substring(0, prefix.length) === prefix;
    };

    var rotate = function(options, current) {
        var colon = options.indexOf(':');
        if (colon == -1) {
            return [options, current];
        }
        var next = options.substring(0, colon);
        var remaining = options.substring(colon + 1);
        if (current) remaining += ':' + current;
        return [next, remaining];
    };

    var methods = {
        init: function (options) {
            var settings = jQuery.extend({
                scroll: 'body',
                persist: true,
                restartPrompt: true,
                onSet: function (attribute, value) {}
            }, options);

            squiffy.ui.output = this;
            squiffy.ui.restart = jQuery(settings.restart);
            squiffy.ui.settings = settings;

            if (settings.scroll === 'element') {
                squiffy.ui.output.css('overflow-y', 'auto');
            }

            initLinkHandler();
            squiffy.story.begin();
            
            return this;
        },
        get: function (attribute) {
            return squiffy.get(attribute);
        },
        set: function (attribute, value) {
            squiffy.set(attribute, value);
        },
        restart: function () {
            if (!squiffy.ui.settings.restartPrompt || confirm('Are you sure you want to restart?')) {
                squiffy.story.restart();
            }
        }
    };

    jQuery.fn.squiffy = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions]
                .apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof methodOrOptions === 'object' || ! methodOrOptions) {
            return methods.init.apply(this, arguments);
        } else {
            jQuery.error('Method ' +  methodOrOptions + ' does not exist');
        }
    };
})();

var get = squiffy.get;
var set = squiffy.set;


squiffy.story.start = 'start';
squiffy.story.id = '58f25e40e4';
squiffy.story.sections = {
	'': {
		'text': "",
		'attributes': ["turns+=1"],
		'js': function() {
			var turns = squiffy.get("turns")
			if (turns == 45) {squiffy.set("canplay", "false")}
		},
		'passages': {
		},
	},
	'start': {
		'text': "<p>Es war ein kühler Frühlingsabend. Dein Geschäft lief gut an. Erst heute Vormittag hattest du ein Gespräch mit einem potenziellen Kunden. Er war begeistert von den <a class=\"squiffy-link link-passage\" data-passage=\"infofähig\" role=\"link\" tabindex=\"0\">Erfolgen</a> deiner <a class=\"squiffy-link link-passage\" data-passage=\"infodetek\" role=\"link\" tabindex=\"0\">Detektei</a>. Du sitzt in einem schönen Restaurant auf der Terrasse und <a class=\"squiffy-link link-section\" data-section=\"go1\" role=\"link\" tabindex=\"0\">fragst dich, ob es dein neuer Fall wird.</a></p>",
		'attributes': ["points = 0","turns = 0"],
		'js': function() {
			playAudioBackground("https://www.youtube.com/audiolibrary_download?vid=e3d12f674d972779")
			squiffy.set("canplay", "true")
		},
		'passages': {
			'infodetek': {
				'text': "<p>Neben deinem Kunst-Studium willst du dir etwas Geld dazu verdienen.</p>",
			},
			'infofähig': {
				'text': "<p>Du hast ein seltenes Gemälde wiederbeschaffen können und erste Belohnung dafür kassiert.</p>",
			},
		},
	},
	'go1': {
		'clear': true,
		'text': "<p>Plötzlich rutscht ein Mann von seinem Stuhl auf den Boden. Rumms!</p>\n<p>Die junge Kellnerin kommt ihm zur Hilfe. Vielleicht ein Schwächeanfall?</p>\n<p>&quot;Geht es Ihnen gut?&quot; fragt sie ihn.</p>\n<p>Er ist ansprechbar, verletzt sieht er nicht aus, aber müde. Es hat sich eine kleine Menschentraube gebildet. Ein weiterer Kellner kam hinzu und ein paar andere Leute, die den Mann kennen. Langsam richtet er sich wieder auf. Die Kellnerin bleibt noch bei ihm, während sich die Stimmung wieder normalisiert.</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"_continue1\" role=\"link\" tabindex=\"0\">Einige Minuten später</a></p>",
		'js': function() {
			playAudio("https://www.youtube.com/audiolibrary_download?vid=7bfd179eef1283d4")
		},
		'passages': {
		},
	},
	'_continue1': {
		'text': "<p>&quot;Wo... Wo ist denn meine Brieftasche?&quot; fragt der Mann sichtlich erschöpft.</p>\n<p>Die Kellnerin findet sie unter dem Nachbarstuhl und gibt sie ihm wieder.</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"fragebrieftasche\" role=\"link\" tabindex=\"0\">&quot;Mh, das kommt mir komisch vor.&quot;</a><br/>\n<a class=\"squiffy-link link-section\" data-section=\"gameover\" role=\"link\" tabindex=\"0\">&quot;Gut. Die Brieftasche ist wieder da.&quot;</a></p>",
		'passages': {
		},
	},
	'fragebrieftasche': {
		'clear': true,
		'text': "<p>Du gehst rüber zum Tisch.</p>\n<p>&quot;Überprüfen Sie bitte ob noch alles da ist.&quot; empfiehlst du ihm.</p>\n<p>Er zählt kurz durch, schaut nach seinen Wertsachen und gibt Entwarnung.</p>\n<p>&quot;Es ist alles da.&quot;</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"gameover\" role=\"link\" tabindex=\"0\">&quot;Super. Ich wollte nur sicher gehen.&quot;</a><br/>\n<a class=\"squiffy-link link-section\" data-section=\"nachfragegeld\" role=\"link\" tabindex=\"0\">&quot;Haben Sie sonst noch etwas, außer Bargeld?&quot;</a></p>",
		'passages': {
		},
	},
	'nachfragegeld': {
		'text': "<p>&quot;Eine Kreditkarte, Schlüsselkarte und ein paar Fotos.&quot; antwortet er.</p>\n<p>Du sagst nichts weiter dazu, aber gehst zur Kellnerin.</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"introdetektiv\" role=\"link\" tabindex=\"0\">&quot;Das kommt mir ungewöhnlich vor. Die Brieftasche lag zu weit weg. Rufen Sie die Polizei. Es befindet sich ein Dieb unter den Gästen&quot;, flüsterst du zur Kellnerin</a></p>",
		'passages': {
		},
	},
	'introdetektiv': {
		'clear': true,
		'text': "<p>Die Kellnerin telefoniert gerade mit der Polizei. Alle Sitzplätze sind wieder besetzt. Der Dieb müsste also noch hier sein. Du musst die Beweise finden und den Täter überführen bevor die Polizei eintrifft.</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"mainround\" role=\"link\" tabindex=\"0\">Das ist genau mein Fall!</a></p>",
		'passages': {
		},
	},
	'mainround': {
		'clear': true,
		'text': "<p>{if canplay=true:Du kannst <a class=\"squiffy-link link-section\" data-section=\"befragen\" role=\"link\" tabindex=\"0\">Personen befragen</a> oder dich <a class=\"squiffy-link link-section\" data-section=\"ort\" role=\"link\" tabindex=\"0\">im Restaurant umsehen</a>.}</p>\n<p>{if canplay=false:Oh, ich höre Sirenen. Die Polizei ist da. <a class=\"squiffy-link link-section\" data-section=\"showdown\" role=\"link\" tabindex=\"0\">Es wird Zeit deine Ergebnisse zu präsentieren.</a>}</p>",
		'passages': {
		},
	},
	'ort': {
		'text': "<p>Vielleicht findest du in der <a class=\"squiffy-link link-passage\" data-passage=\"kueche\" role=\"link\" tabindex=\"0\">Küche</a>{if beweis:}{else:, <a class=\"squiffy-link link-section\" data-section=\"tisch\" role=\"link\" tabindex=\"0\">am Tisch</a>}, an der <a class=\"squiffy-link link-passage\" data-passage=\"Garderobe\" role=\"link\" tabindex=\"0\">Garderobe</a> oder <a class=\"squiffy-link link-passage\" data-passage=\"WC\" role=\"link\" tabindex=\"0\">im WC</a> einen Hinweis auf den Täter?</p>",
		'passages': {
			'kueche': {
				'text': "<p>Kurz vor der Tür wirst du vom Personal abgefangen.</p>\n<p>&quot;Entschuldigungen Sie, die Küche ist nur für Mitarbeiter.&quot;</p>\n<p>&quot;Kann ich mich dort mal umsehen?&quot;</p>\n<p>&quot;Das geht leider nicht.&quot;</p>",
			},
			'WC': {
				'text': "<p>Die Räume sind sauber und nicht zu beanstanden.</p>\n<p><a class=\"squiffy-link link-passage\" data-passage=\"pippi\" role=\"link\" tabindex=\"0\">Du musst dringend pinkeln.</a></p>",
			},
			'pippi': {
				'text': "<p>Zipp!</p>\n<p>Pssssssssss!</p>\n<p>Zipp.</p>\n<p>Fertig!</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"mainround\" role=\"link\" tabindex=\"0\">Erneut überlegen was zu tun ist.</a></p>",
			},
			'Garderobe': {
				'text': "<p>Hier hängen ein paar Jacken der Gäste. Nichts besonderes. Die Jacken für das Personal werden anderswo aufbewahrt.</p>",
			},
		},
	},
	'tisch': {
		'text': "<p>Du schaust dir <a class=\"squiffy-link link-passage\" data-passage=\"checktisch\" role=\"link\" tabindex=\"0\">den Tisch</a>, <a class=\"squiffy-link link-passage\" data-passage=\"checkwein\" role=\"link\" tabindex=\"0\">das Weinglas</a> oder <a class=\"squiffy-link link-passage\" data-passage=\"checkwagen\" role=\"link\" tabindex=\"0\">den Servierwagen</a> an.</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"mainround\" role=\"link\" tabindex=\"0\">Erneut überlegen was zu tun ist.</a></p>",
		'passages': {
			'checktisch': {
				'text': "<p>Alles sieht normal aus.</p>",
			},
			'checkwein': {
				'text': "<p>Der Wein riecht etwas komisch.</p>\n<p>&quot;Ist das ein guter Jahrgang? Darf ich probieren?&quot;</p>\n<p>&quot;Natürlich, Sie sind ein Kenner.&quot;</p>\n<p>Er schmeckt etwas ungewöhnlich und du wirst direkt müde. Hier wurde nachgeholfen.</p>\n<p>&quot;Trinken Sie den besser nicht mehr.&quot;</p>\n<p>&quot;Wie Sie meinen. Ich habe sowieso das Gefühl zu viel getrunken zu haben. Dabei war es nur ein einziges Glas.&quot;</p>",
			},
			'checkwagen': {
				'text': "<p>Ein Servierwagen mit einer langen, weißen <a class=\"squiffy-link link-passage\" data-passage=\"checkdecke\" role=\"link\" tabindex=\"0\">Tischdecke</a>.</p>",
			},
			'checkdecke': {
				'text': "<p>Hinter der Tischdecke werden die <a class=\"squiffy-link link-passage\" data-passage=\"checkgeraet\" role=\"link\" tabindex=\"0\">Kartengeräte</a> aufbewahrt.</p>",
			},
			'checkgeraet': {
				'text': "<p>Du schaust dir die Geräte an und eines davon sieht anders aus. Es ist tatsächlich ein anderes <a class=\"squiffy-link link-section\" data-section=\"getgeraet\" role=\"link\" tabindex=\"0\">Gerät</a>, dass Chipkarten lesen und schreiben kann. Damit könnte die Karte von {if seen getopfername:Herr Selleck}{else:dem Opfer} kopiert worden sein.</p>",
			},
		},
	},
	'getgeraet': {
		'text': "<p>Es gibt einige rote Flecken auf dem Gerät. Es scheint rote Grütze zu sein. Du steckst das Gerät als Beweismittel ein.</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"mainround\" role=\"link\" tabindex=\"0\">Erneut überlegen was zu tun ist.</a><br/>\n<a class=\"squiffy-link link-section\" data-section=\"showdown\" role=\"link\" tabindex=\"0\">Du kannst dein Ergebnis der Polizei präsentieren.</a></p>",
		'attributes': ["beweis"],
		'passages': {
		},
	},
	'befragen': {
		'text': "<p>Du kannst {if seen getopfername:<a class=\"squiffy-link link-section\" data-section=\"opfer\" role=\"link\" tabindex=\"0\">Herr Selleck</a>}{else: <a class=\"squiffy-link link-section\" data-section=\"opfer\" role=\"link\" tabindex=\"0\">das Opfer</a>}{if aushilfe:, <a class=\"squiffy-link link-section\" data-section=\"aushilfebefragen\" role=\"link\" tabindex=\"0\">die Aushilfe</a>}{else:, die <a class=\"squiffy-link link-section\" data-section=\"befragekellnerin\" role=\"link\" tabindex=\"0\">junge Kellnerin</a>}{if dermannweises:}{else: oder den <a class=\"squiffy-link link-section\" data-section=\"befragealtenMann\" role=\"link\" tabindex=\"0\">alten Mann im Sessel</a>} befragen.</p>",
		'passages': {
		},
	},
	'opfer': {
		'clear': true,
		'text': "<p>&quot;Guten Abend, ich muss Ihnen leider mitteilen, dass Sie Opfer eines Verbrechens geworden sind.&quot;</p>\n<p>&quot;Wirklich? Was ist denn passiert?&quot;</p>\n<p>&quot;Keine Sorge. Das werde ich noch aufklären. Würden Sie mir dazu ein paar Fragen beantworten?&quot;</p>\n<p>&quot;Selbstverständlich.&quot;</p>\n<p>{if seen getopfername:}{else:<a class=\"squiffy-link link-passage\" data-passage=\"getopfername\" role=\"link\" tabindex=\"0\">&quot;Wie ist Ihr Name?&quot;</a><br/>}\n{if seen sindsiereich:}{else:<a class=\"squiffy-link link-passage\" data-passage=\"sindsiereich\" role=\"link\" tabindex=\"0\">&quot;Wer könnte Ihnen schaden wollen? Sind Sie besonders reich?&quot;</a><br/>}\n{if seen wirklichtresor:}{else:<a class=\"squiffy-link link-passage\" data-passage=\"wozuschluesselkarte\" role=\"link\" tabindex=\"0\">&quot;Wohin führt die Schlüsselkarte in Ihrem Geldbeutel?&quot;</a><br/>}\n{if seen habensiefeinde:}{else:<a class=\"squiffy-link link-passage\" data-passage=\"habensiefeinde\" role=\"link\" tabindex=\"0\">&quot;Haben Sie irgendwelche persönlichen Feinde?&quot;</a><br/>}\n<a class=\"squiffy-link link-section\" data-section=\"kreditkartenklau\" role=\"link\" tabindex=\"0\">&quot;Jemand könnte Ihre Kreditkarte kopiert haben.&quot;</a></p>\n<p><a class=\"squiffy-link link-section\" data-section=\"mainround\" role=\"link\" tabindex=\"0\">Erneut überlegen was zu tun ist.</a></p>",
		'passages': {
			'getopfername': {
				'text': "<p>&quot;Selleck, Timothy Selleck.&quot;</p>",
			},
			'sindsiereich': {
				'text': "<p>&quot;Ich habe tatsächlich etwas Geld geerbt, aber ich hänge es nicht an die große Glocke.&quot;</p>",
			},
			'wozuschluesselkarte': {
				'text': "<p>&quot;Diese Karte ist für einen Tresor in meiner Wohnung.&quot;</p>\n<p><a class=\"squiffy-link link-passage\" data-passage=\"wasistintresor\" role=\"link\" tabindex=\"0\">&quot;Was bewahren Sie dort auf?&quot;</a></p>",
			},
			'wasistintresor': {
				'text': "<p>&quot;Naja, einige persönliche Unterlagen, nichts von großem Wert.&quot;</p>\n<p><a class=\"squiffy-link link-passage\" data-passage=\"wirklichtresor\" role=\"link\" tabindex=\"0\">&quot;Gibt es sonst wirklich nichts in diesem Tresor?&quot;</a></p>",
			},
			'wirklichtresor': {
				'text': "<p>&quot;Ich habe ein wertvolles Gemälde ersteigert. Mit meinem Erbe wollte ich ins Kunstgeschäft einsteigen, aber davon weiß noch niemand.&quot;</p>",
				'attributes': ["motiv"],
			},
			'habensiefeinde': {
				'text': "<p>&quot;Ich hatte keinen Streit, wenn Sie das meinen.&quot;</p>",
			},
		},
	},
	'kreditkartenklau': {
		'text': "<p>&quot;Das glaube ich kaum. Auf dieser Karten befindet sich nur ein kleiner Betrag. Da hätte der Dieb ziemliches Pech gehabt.&quot;</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"gameover\" role=\"link\" tabindex=\"0\">Mist, das war meine beste Theorie.</a><br/>\n<a class=\"squiffy-link link-section\" data-section=\"mainround\" role=\"link\" tabindex=\"0\">Du fragst dich weiter durch.</a></p>",
		'passages': {
		},
	},
	'befragekellnerin': {
		'clear': true,
		'text': "<p>&quot;Hallo, kann ich Ihnen ein paar Fragen stellen?&quot;</p>\n<p>&quot;Ja gerne, aber ich bin furchtbar im Stress. Jetzt dieser Diebstahl und die ungeschickte Aushilfe. Heute ist nicht mein Tag. Können Sie diese Sache so diskret wie möglich behandeln? Ich möchte die Gäste nicht verschrecken.&quot;</p>\n<p><a class=\"squiffy-link link-passage\" data-passage=\"jadiskret\" role=\"link\" tabindex=\"0\">&quot;Klar, das ist kein Problem&quot;</a><br/>\n<a class=\"squiffy-link link-passage\" data-passage=\"kennensieopfer\" role=\"link\" tabindex=\"0\">&quot;Kennen Sie {if seen getopfername:Herr Selleck}{else: den Herr mit der Brieftasche} gut?&quot;</a><br/>\n<a class=\"squiffy-link link-passage\" data-passage=\"fragepersonal\" role=\"link\" tabindex=\"0\">&quot;Gutes Personal ist schwierig zu finden?&quot;</a></p>\n<p><a class=\"squiffy-link link-section\" data-section=\"mainround\" role=\"link\" tabindex=\"0\">Erneut überlegen was zu tun ist.</a></p>",
		'passages': {
			'fragepersonal': {
				'text': "<p>&quot;Ja, wieso meldet man sich als Aushilfe, wenn man kaum zwei Teller tragen kann?&quot;</p>",
				'attributes': ["aushilfe"],
			},
			'jadiskret': {
				'text': "<p>&quot;Vielen Dank!&quot;</p>",
			},
			'kennensieopfer': {
				'text': "<p>&quot;Er ist hier Stammgast. Er sitzt sogar immer am gleichen Platz. Das ist kein Geheimnis.&quot;</p>",
			},
		},
	},
	'befragealtenMann': {
		'clear': true,
		'text': "<p>Du gehst zu dem alten Mann im Sessel. Er raucht seine Zigarre und beobachtet das Kaminfeuer.</p>\n<p>&quot;Guten Abend, sind Sie öfters hier?&quot;</p>\n<p>&quot;Hallo junger Mann. Dieser Laden gefällt mir, ich war aber erst ein paar mal hier.&quot;</p>\n<p><a class=\"squiffy-link link-passage\" data-passage=\"kennsiedenmann\" role=\"link\" tabindex=\"0\">&quot;Kennen Sie den Mann, der den Schwächanfall hatte?&quot;</a></p>",
		'passages': {
			'kennsiedenmann': {
				'text': "<p>&quot;Nein, keine Ahnung!&quot;</p>\n<p><a class=\"squiffy-link link-passage\" data-passage=\"eristkunstsammler\" role=\"link\" tabindex=\"0\">&quot;Sein neues Hobby scheint stressig zu sein. Das hätte ich mir nicht so vorgestellt.&quot;</a></p>",
			},
			'eristkunstsammler': {
				'text': "<p>&quot;Seine Arbeit sucht man sich immer noch selbst aus. Wenn er unbedingt ins Kunstgeschäft möchte...&quot;</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"mainround\" role=\"link\" tabindex=\"0\">Erneut überlegen was zu tun ist.</a></p>",
				'attributes': ["dermannweises"],
			},
		},
	},
	'aushilfebefragen': {
		'clear': true,
		'text': "<p>Du gehst in die Küche und siehst einen jungen Mann, der versucht drei große Teller auf einer Hand zu balancieren. Seine Hose hat ein paar rote Flecken vom Essen abbekommen.</p>\n<p>{if beweis:\n&quot;Hallo nochmal. Wie landete eigentlich diese rote Grütze auf diesem Kartenlesegerät?&quot;</p>\n<p>&quot;Oh, ähm keine Ahnung. Damit muss ich wohl abgerechnet haben.&quot;</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"fangdendieb\" role=\"link\" tabindex=\"0\">&quot;Als Aushilfe dürfen Sie doch nicht abrechnen.&quot;</a><br/>\n<a class=\"squiffy-link link-section\" data-section=\"mainround\" role=\"link\" tabindex=\"0\">&quot;Naja dann!&quot;</a>\n}{else:\n&quot;Hallo, arbeiten Sie schon lange hier?&quot;</p>\n<p>&quot;Nur heute.&quot;</p>\n<p><a class=\"squiffy-link link-passage\" data-passage=\"warumgastro\" role=\"link\" tabindex=\"0\">&quot;Warum musste es ausgerechnet die Gastronomie sein?&quot;</a><br/>\n<a class=\"squiffy-link link-passage\" data-passage=\"warwaskomisch\" role=\"link\" tabindex=\"0\">&quot;Ist dir etwas Ungewöhnliches aufgefallen?&quot;</a>\n}</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"mainround\" role=\"link\" tabindex=\"0\">Erneut überlegen was zu tun ist.</a></p>",
		'passages': {
			'warumgastro': {
				'text': "<p>&quot;Das ist nur ein Nebenjob.&quot;</p>",
			},
			'warwaskomisch': {
				'text': "<p>&quot;Ich habe nichts bemerkt.&quot;</p>",
			},
		},
	},
	'fangdendieb': {
		'text': "<p>Die Aushilfe stottert vor sich hin.</p>\n<p>&quot;Außerdem lassen sich damit auch Karten kopieren.&quot;</p>\n<p>Du legst nach: &quot;Schon mal an Fingerabdrücke gedacht?&quot;</p>\n<p>Er sagt nichts mehr.</p>\n<p><a class=\"squiffy-link link-passage\" data-passage=\"pruefepolizei\" role=\"link\" tabindex=\"0\">&quot;Ich werde Sie von der Polizei überprüfen lassen.&quot;</a><br/>\n<a class=\"squiffy-link link-section\" data-section=\"woistkarte\" role=\"link\" tabindex=\"0\">&quot;Wo befindet sich die kopierte Karte?&quot;</a></p>\n<p><a class=\"squiffy-link link-section\" data-section=\"mainround\" role=\"link\" tabindex=\"0\">Erneut überlegen was zu tun ist.</a></p>",
		'attributes': ["dermannweises"],
		'passages': {
			'pruefepolizei': {
				'text': "<p>&quot;Das war alles seine Idee. Der alte Mann am Kamin.&quot;</p>",
				'attributes': ["diebgefunden"],
			},
		},
	},
	'woistkarte': {
		'text': "<p>&quot;Sie ist in seiner Jacke an der Garderobe.&quot;</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"mainround\" role=\"link\" tabindex=\"0\">Weiter überlegen was zu tun ist.</a><br/>\n<a class=\"squiffy-link link-section\" data-section=\"showdown\" role=\"link\" tabindex=\"0\">Du kannst dein Ergebnis der Polizei präsentieren.</a></p>",
		'attributes': ["canplay=false","kartegefunden"],
		'passages': {
		},
	},
	'showdown': {
		'text': "<p>&quot;Hallo Herr Wachtmeister?&quot;</p>\n<p><a class=\"squiffy-link link-passage\" data-passage=\"ichweis\" role=\"link\" tabindex=\"0\">&quot;Ich weiß genau, wer der Dieb ist.&quot;</a><br/>\n<a class=\"squiffy-link link-section\" data-section=\"gameover\" role=\"link\" tabindex=\"0\">&quot;Keine Ahnung was passiert ist...&quot;</a></p>",
		'passages': {
			'ichweis': {
				'text': "<p>&quot;Na dann erzählen Sie mal.&quot;</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"gamoveranswer\" role=\"link\" tabindex=\"0\">&quot;Herr Selleck wurde Falschgeld ins Portmonee geschmuggelt.&quot;</a><br/>\n{if kartegefunden:<a class=\"squiffy-link link-section\" data-section=\"finishkarte\" role=\"link\" tabindex=\"0\">&quot;Es wurde eine Karte aus dem Geldbeutel kopiert.&quot;</a><br/>}\n<a class=\"squiffy-link link-section\" data-section=\"gameover\" role=\"link\" tabindex=\"0\">&quot;Ich weiß es leider doch nicht...&quot;</a></p>",
			},
		},
	},
	'finishkarte': {
		'text': "<p>&quot;Aha, wissen Sie auch wer es war?&quot;</p>\n<p>{if diebgefunden:<a class=\"squiffy-link link-section\" data-section=\"finishkellner\" role=\"link\" tabindex=\"0\">&quot;Die Aushilfe hat ein spezielles Gerät dafür.&quot;</a><br/>}\n<a class=\"squiffy-link link-section\" data-section=\"gameover\" role=\"link\" tabindex=\"0\">&quot;Die Kellnerin sieht nervös aus. Sie war es!&quot;</a><br/>\n<a class=\"squiffy-link link-section\" data-section=\"gameover\" role=\"link\" tabindex=\"0\">&quot;Ich weiß es leider nicht...&quot;</a></p>",
		'passages': {
		},
	},
	'finishkellner': {
		'text': "<p>&quot;Und wo ist die kopierte Karte?&quot;</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"gameover\" role=\"link\" tabindex=\"0\">&quot;Sie kann überall versteckt sein!&quot;</a><br/>\n{if kartegefunden:<a class=\"squiffy-link link-section\" data-section=\"prefinish\" role=\"link\" tabindex=\"0\">&quot;Sie befindet sich in der Jackentasche eines Gastes.&quot;</a><br/>}\n<a class=\"squiffy-link link-section\" data-section=\"gameover\" role=\"link\" tabindex=\"0\">&quot;Sie liegt unter dem Servierwagen&quot;</a></p>",
		'passages': {
		},
	},
	'prefinish': {
		'text': "<p>&quot;Und was hatte er damit vor?&quot;</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"gamoveranswer\" role=\"link\" tabindex=\"0\">&quot;Er wollte Ihn vergiften!&quot;</a><br/>\n<a class=\"squiffy-link link-passage\" data-passage=\"komplizen\" role=\"link\" tabindex=\"0\">&quot;Sie wollten Ihn ausrauben. Es sind sogar zwei.&quot;</a></p>",
		'passages': {
			'komplizen': {
				'text': "<p>&quot;Es gibt einen Komplizen? Wen denn?&quot;</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"gameover\" role=\"link\" tabindex=\"0\">&quot;Die Kellnerin war es.&quot;</a><br/>\n<a class=\"squiffy-link link-section\" data-section=\"gameover\" role=\"link\" tabindex=\"0\">&quot;Der Küchenchef!&quot;</a><br/>\n{if dermannweises:<a class=\"squiffy-link link-section\" data-section=\"finish\" role=\"link\" tabindex=\"0\">&quot;Der alte Mann am Kamin.&quot;</a>}</p>",
			},
		},
	},
	'finish': {
		'clear': true,
		'text': "<p>&quot;Wow, das war gute Arbeit. Wir konnten alle Beweise sichern. Diese beiden Diebe waren gesuchte Betrüger. Allerdings hat sich die Aushilfe direkt aus dem Staub gemacht.&quot; sagt der Polizist und schiebt den alten Mann in seinen Streifenwagen.</p>\n<p>Perfekt kombiniert, du konntest den Fall lösen. Herzlichen Glückwunsch!</p>\n<p>{stats}</p>",
		'js': function() {
			playAudio("https://www.youtube.com/audiolibrary_download?vid=7a66710a6b83c23a")
		},
		'passages': {
		},
	},
	'gamoveranswer': {
		'clear': true,
		'text': "<p>Die Polizei hat deine Theorie geprüft und konnte keine Beweise finden. Alles falsch. Du bist ein lausiger Detektiv!</p>\n<p>{stats}</p>",
		'js': function() {
			playAudio("https://www.youtube.com/audiolibrary_download?vid=eaea3afc8466b5d2")
		},
		'passages': {
		},
	},
	'gameover': {
		'clear': true,
		'text': "<p>Du konntest den Fall nicht lösen.{if seen nachfragegeld:}{else: Du wusstest nicht einmal, dass es überhaupt dein Fall war.}{if dermannweises:}{else: Du hast den Dieb nicht gefunden.}{if kartegefunden:}{else: Du hast das Beweisstück nicht gefunden.} Alles falsch. Du bist ein lausiger Detektiv!</p>\n<p>{stats}</p>",
		'js': function() {
			playAudio("https://www.youtube.com/audiolibrary_download?vid=eaea3afc8466b5d2")
		},
		'passages': {
		},
	},
	'stats': {
		'text': "<p>Du hast {turns} Entscheidungen getroffen.</p>",
		'passages': {
		},
	},
}
})();
