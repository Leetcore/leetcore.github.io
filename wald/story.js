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
squiffy.story.id = 'fc5fe836a6';
squiffy.story.sections = {
	'_default': {
		'text': "",
		'attributes': ["health 100"],
		'passages': {
		},
	},
	'': {
		'clear': true,
		'text': "",
		'attributes': ["turns+=1"],
		'passages': {
		},
	},
	'start': {
		'text': "<p><h1>Der verfluchte Wald</h1>\nDu wirst langsam wach und fühlst dich benommen, als hätte dich etwas am Kopf getroffen. Dir ist kalt und du liegst im Dreck. Die Erde ist feucht und riecht komisch. Du hast einen Riss in deiner Jacke. Es ist düster. <a class=\"squiffy-link link-section\" data-section=\"start2\" role=\"link\" tabindex=\"0\">Deine Erinnerung kommt zurück.</a></p>",
		'js': function() {
			playAudioBackground("https://www.youtube.com/audiolibrary_download?vid=0c9ae029c07f8594")
		},
		'passages': {
		},
	},
	'start2': {
		'text': "<p>Lara, deine Tocher, rannte in den Wald. Ihr wart auf dem Weg nach Hause. Sie lief aus dem Auto und war eben noch direkt vor dir...  Sie muss diesen kleinen Pfad in den Wald gelaufen sein.</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"renn1\" role=\"link\" tabindex=\"0\">Du rennst den Pfad entlang</a> oder <a class=\"squiffy-link link-passage\" data-passage=\"startsuche\" role=\"link\" tabindex=\"0\">schaust dich um</a>.</p>",
		'passages': {
			'startsuche': {
				'text': "<p>Es liegt eine <a class=\"squiffy-link link-passage\" data-passage=\"Taschenlampe\" role=\"link\" tabindex=\"0\">Taschenlampe</a> im Gras. Sie muss dir gehören, sonst ist niemand hier.</p>",
			},
			'Taschenlampe': {
				'text': "<p>Du hebst die Taschenlampe auf und steckst sie in deine Tasche.</p>",
				'attributes': ["taschenlampe"],
			},
		},
	},
	'renn1': {
		'text': "<p>Du rennst los in das dunkle Unbekannte. Auf dem Pfad sind ein paar Spuren, aber du kannst sie nicht zuordnen. Du weißt nicht, wie lange du dort gelegen hast, vielleicht ist es schon zu spät? Du rennst so schnell es geht.</p>\n<p>Ein Ast bringt dich zum Stolpern. Du fällst und drehst dich in Richtung <a class=\"squiffy-link link-section\" data-section=\"Mauer\" role=\"link\" tabindex=\"0\">Hügel</a> oder einem kleinen <a class=\"squiffy-link link-section\" data-section=\"Abhang\" role=\"link\" tabindex=\"0\">Abhang</a>, um den Sturz abzufangen.</p>",
		'passages': {
		},
	},
	'Mauer': {
		'text': "<p>Du knallst mit dem Kopf auf einen Stein und wirst ohmächtig. Einige Stunden später findet dich ein Rudel Wölfe und zerreisen dich. Mahlzeit.</p>\n<p>{gameover}</p>",
		'js': function() {
			playAudio("https://www.youtube.com/audiolibrary_download?vid=5c5225edbf448503")
		},
		'passages': {
		},
	},
	'Abhang': {
		'text': "<p>Du sackst etwas ab, aber landest im Moos. Die nasse Erde macht dir nichts aus. Du ignorierst den Schmerz und stehst wieder auf. Du bist etwas wackelig auf den Beinen, aber es muss weiter gehen. Der Pfad teilt sich vor dir. Du musst dich entscheiden welchen Weg du weiter läufst.</p>\n<p>Es gibt zwei kleine Schilder, die in verschiedene Richtungen zeigen. Beide sind nicht mehr zu lesen. </p>\n<p><a class=\"squiffy-link link-section\" data-section=\"renn2\" role=\"link\" tabindex=\"0\">Auf deinem Pfad bleiben</a> oder auf <a class=\"squiffy-link link-section\" data-section=\"renn3\" role=\"link\" tabindex=\"0\">den Pfad neben dem Bach gehen</a>.</p>",
		'passages': {
		},
	},
	'renn2': {
		'text': "<p>Das Geräusch beunruhigt dich. Außerdem bist du völlig außer Atem. Du bleibst einige Sekunde stehen, um wieder Luft zu bekommen. Es ist nicht zu orten, aus welcher Richtung das Heulen kam und du hoffst daran vorbei zu laufen.</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"wolf1\" role=\"link\" tabindex=\"0\">Etwas bewegt sich auf dich zu.</a></p>",
		'js': function() {
			playAudio("https://www.youtube.com/audiolibrary_download?vid=fc1a709809deb6e0")
		},
		'passages': {
		},
	},
	'renn3': {
		'text': "<p>Das Geräusch beunruhigt dich. Du hoffst daran vorbei zu laufen. Trotzdem überläuft es dich kalt und du rennst noch schneller.</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"baer1\" role=\"link\" tabindex=\"0\">Etwas bewegt sich auf dich zu.</a></p>",
		'js': function() {
			playAudio("https://www.youtube.com/audiolibrary_download?vid=fc1a709809deb6e0")
		},
		'passages': {
		},
	},
	'wolf1': {
		'text': "<p>Vor dir steht ein ausgewachsener Wolf und zeigt dir seine Reißzähne. Du gefrierst auf der Stelle.</p>\n<p><a class=\"squiffy-link link-passage\" data-passage=\"stehen bleiben\" role=\"link\" tabindex=\"0\">Du bleibst starr stehen</a>, <a class=\"squiffy-link link-section\" data-section=\"suchewaffe\" role=\"link\" tabindex=\"0\">du suchst dir eine Waffe</a>{if taschenlampe:, <a class=\"squiffy-link link-section\" data-section=\"taschenlampe\" role=\"link\" tabindex=\"0\">du blendest ihn mit deiner Taschenlampe</a>} oder <a class=\"squiffy-link link-section\" data-section=\"rennstweg\" role=\"link\" tabindex=\"0\">du rennst weg</a>.</p>",
		'js': function() {
			playAudio("https://www.youtube.com/audiolibrary_download?vid=25ca6726c6c1b44e")
		},
		'passages': {
			'stehen bleiben': {
				'text': "<p>Er will dich jagen. Du musst etwas tun.</p>",
			},
		},
	},
	'taschenlampe': {
		'text': "<p>Der Lichtkegel der Lampe flackert in seinen Augen. Er scheint von dir ab zu lassen. Geblendet kann es nicht gegen dich kämpfen. Wow, was ein Glück du hattest!</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"wingegentier\" role=\"link\" tabindex=\"0\">Du verschnaufst einige Minuten und lauschst den Geräuschen des Waldes.</a></p>",
		'passages': {
		},
	},
	'rennstweg': {
		'text': "<p>Jetzt oder nie. Du rennst einige Meter, doch sobald du dem Tier den Rücken zugedreht hast, schnappt es dich. Ein Biss in den Oberschenkel. Dein Blut spritzt. Du schlägst nach ihm. Doch du bist zu schwach. Fällst. Der zweite Biss sitzt. Dein Hals.</p>\n<p>{gameover}</p>",
		'js': function() {
			playAudio("https://www.youtube.com/audiolibrary_download?vid=5c5225edbf448503")
		},
		'passages': {
		},
	},
	'suchewaffe': {
		'text': "<p>Du fängst an den Boden abzutasten und fühlst einen <a class=\"squiffy-link link-passage\" data-passage=\"Stein\" role=\"link\" tabindex=\"0\">Stein</a>, der genau in deine Handfläche passt.</p>",
		'passages': {
			'Stein': {
				'text': "<p>Du hebst den Stein auf. Und greifst das Tier an. Du zielst auf die <a class=\"squiffy-link link-section\" data-section=\"Schnauze\" role=\"link\" tabindex=\"0\">Schnauze</a>, <a class=\"squiffy-link link-section\" data-section=\"Augen\" role=\"link\" tabindex=\"0\">Augen</a> oder den <a class=\"squiffy-link link-section\" data-section=\"Körper\" role=\"link\" tabindex=\"0\">Körper</a>.</p>",
			},
		},
	},
	'Körper': {
		'text': "<p>Du driffst den Körper, während der Wolf seine Fangzähne in deinen Arm schiebt. Du heulst vor Schmerz, aber nicht mehr lange, denn der zweite Biss sitzt.</p>\n<p>{gameover}</p>",
		'passages': {
		},
	},
	'Schnauze': {
		'text': "<p>Du nimmst all deinen Mut zusammen und versucht seine Schnauze zu treffen, doch der Wolf weicht aus und beißt blitzschnell zu. Dein Blut spritzt auf den Boden. Er reißt an deinem Arm. Du versuchst ihn von dir weg zu stoßen, aber du bist zu schwach. Das letzte Bild vor deinem Tod sind seine glühenden Augen.</p>\n<p>{gameover}</p>",
		'js': function() {
			playAudio("https://www.youtube.com/audiolibrary_download?vid=5c5225edbf448503")
		},
		'passages': {
		},
	},
	'Augen': {
		'text': "<p>{if win=0:{loose}}{else:{win}}</p>",
		'js': function() {
			squiffy.set("win", Math.round(Math.random()));
		},
		'passages': {
			'win': {
				'text': "<p>Du triffst ihn mit dem Stein am rechten Auge. Es scheint wie Glut in seinen Augen zu brennen. Fauchend zieht er sich in den Wald zurück. Puh, du lebst noch. Das war wirklich knapp.</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"wingegentier\" role=\"link\" tabindex=\"0\">Du verschnaufst einige Minuten und lauschst den Geräuschen des Waldes.</a></p>",
			},
			'loose': {
				'text': "<p>Du verfehlst ihn und er beißt direkt zu. Blut spritzt aus deinem Bein ins Gras. Du versuchst ihn abzuschütteln, doch er ist zu stark. Er zielt auf deinen Hals. <a class=\"squiffy-link link-section\" data-section=\"loose2\" role=\"link\" tabindex=\"0\">Dreh dich schnell weg!</a></p>",
			},
		},
	},
	'loose2': {
		'text': "<p>Es hat dir nicht geholfen. Der Biss sitzt.</p>\n<p>{gameover}</p>",
		'js': function() {
			playAudio("https://www.youtube.com/audiolibrary_download?vid=5c5225edbf448503")
		},
		'passages': {
		},
	},
	'baer1': {
		'text': "<p>Ein sehr großes Tier kommt auf dich zu. Was tust du?</p>\n<p><a class=\"squiffy-link link-passage\" data-passage=\"bstehenbleiben\" role=\"link\" tabindex=\"0\">Du bleibst ruhig stehen</a> oder <a class=\"squiffy-link link-section\" data-section=\"brennweg\" role=\"link\" tabindex=\"0\">du rennst weg</a>.</p>",
		'js': function() {
			playAudio("https://www.youtube.com/audiolibrary_download?vid=25ca6726c6c1b44e")
		},
		'passages': {
			'bstehenbleiben': {
				'text': "<p>Es kommt langsam auf dich zu.</p>",
			},
		},
	},
	'brennweg': {
		'text': "<p>Du sprintest quer durch den Wald. Die Jagd ist eröffnet. Du bist dir nicht sicher, wie nah es hinter dir ist.</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"bumdrehen\" role=\"link\" tabindex=\"0\">Sieh dich kurz um</a> oder <a class=\"squiffy-link link-passage\" data-passage=\"bweiter\" role=\"link\" tabindex=\"0\">renn einfach weiter!</a></p>",
		'passages': {
			'bweiter': {
				'text': "<p>Die Geräusche hinter dir werden immer lauter!</p>",
			},
		},
	},
	'bumdrehen': {
		'text': "<p>Du drehst dich um. Es ist ein Bär! Der Abstand ist aber noch relativ groß. Du kannst besser über die toten Bäume springen, aber ein Ast wird dir zum Verhängnis. Du fällst kopfüber in eine kleine Quelle, die friedlich durch den Wald läuft. Durch den harten Aufprall mit dem Kopf wirst du ohnmächtig. Dein Körper liegt im Wasser.</p>\n<p>Der Bär hat keine Interesse mehr an dir, denn in einigen Minuten wirst du erstickt sein.</p>\n<p>{gameover}</p>",
		'js': function() {
			playAudio("https://www.youtube.com/audiolibrary_download?vid=5c5225edbf448503")
		},
		'passages': {
		},
	},
	'wingegentier': {
		'text': "<p>Du bist völlig erschöpft und verängstigt, deshalb kannst du nicht mehr weiter laufen. Du versuchst langsam weiter zu gehen. Ein Schritt nach dem anderen.</p>\n<p>Der Pfad führt etwas weiter hinauf auf einen Hügel. Als du an einem großen Baum vorbei kommst, siehst du ein Mädchen auf dem Weg. Das ist sie. Du hast Lara gefunden!</p>\n<p><a class=\"squiffy-link link-passage\" data-passage=\"ende1\" role=\"link\" tabindex=\"0\">Du rennst zu ihr.</a></p>",
		'passages': {
			'ende1': {
				'text': "<p>Sie bewegt sich kaum, ist geschockt und halb erfrohren. Du drückst sie fest an dich.</p>\n<p>Sie ist ganz still und voller Blut.</p>\n<p>&quot;Wo warst du?&quot;<br/>\n&quot;Bist du verletzt?&quot;<br/>\n&quot;Was ist passiert?&quot;</p>\n<p><a class=\"squiffy-link link-section\" data-section=\"finish\" role=\"link\" tabindex=\"0\">Du drückst sie nochmal an dich.</a></p>",
			},
		},
	},
	'gameover': {
		'text': "<p>{stats}</p>\n<p>Du bist tot!</p>",
		'passages': {
		},
	},
	'finish': {
		'text': "<p>{stats}</p>\n<p>Dein Herz springt in deiner Brust. Ihr habt es tatsächlich überlebt. Du willst diese Nacht schnell vergessen. Trotzdem wirst du dich fragen müssen, warum diese beiden Männer zerbissen auf dem Boden liegen und sich nicht mehr bewegen...</p>\n<p><b>Fortsetzung folgt...</b></p>",
		'js': function() {
			playAudio("https://www.youtube.com/audiolibrary_download?vid=2aeef78a6812523b")
		},
		'passages': {
		},
	},
	'stats': {
		'text': "<p>Du konntest {turns} Entscheidungen treffen.</p>",
		'passages': {
		},
	},
}
})();
