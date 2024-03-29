/**
 * Javascript for the profile form
 * @source: http://gitorious.org/mahara/mahara
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL version 3 or later
 * @copyright  For copyright information on Mahara, please see the README file distributed with this software.
 *
 */

// Stuff
addLoadEvent(function() {
    var fieldsets = getElementsByTagAndClassName('fieldset', null, 'profileform');

    // Grab the legends
    var legends = getElementsByTagAndClassName('legend', null, 'profileform');

    var tabs = [];
    forEach(legends, function(legend) {
        var a = A({'href': ''}, scrapeText(legend));
        var accessibleText = SPAN({'class':'accessible-hidden'}, '(' + get_string('tab') + ')');
        appendChildNodes(a, accessibleText);

        legend.parentNode.tabLink = a;
        legend.parentNode.tabAccessibleText = accessibleText;

        // Pieforms is unhelpful with legend/fieldset ids; get it from children
        var fsid = 'general';
        var row = getFirstElementByTagAndClassName('tr', 'html', legend.parentNode);
        if (row) {
            fsid = getNodeAttribute(row, 'id').replace(/^profileform_(.*)description_container$/, '$1');
        }
        a.id = fsid + '_a';
        connect(a, 'onclick', function(e) {
            forEach(fieldsets, function(fieldset) {
                if (fieldset == legend.parentNode) {
                    addElementClass(fieldset.tabLink.parentNode, 'current-tab');
                    addElementClass(fieldset.tabLink, 'current-tab');
                    removeElementClass(fieldset, 'safe-hidden');
                    removeElementClass(fieldset, 'collapsed');
                    fieldset.tabAccessibleText.innerHTML = '(' + get_string('tab') + ' ' + get_string('selected') + ')';
                    $j(fieldset).find(':input').first().focus();
                    $('profileform_fs').value = fsid;
                }
                else if (hasElementClass(fieldset.tabLink.parentNode, 'current-tab')) {
                    removeElementClass(fieldset.tabLink.parentNode, 'current-tab');
                    removeElementClass(fieldset.tabLink, 'current-tab');
                    addElementClass(fieldset, 'collapsed');
                    fieldset.tabAccessibleText.innerHTML = '(' + get_string('tab') + ')';
                }
            });
            e.stop();
        });
        tabs.push(LI(null, a));
    });
    var tabUL = UL({'class': 'in-page-tabs'}, tabs);
    var tabTitleSpan = SPAN({'class': 'rd-tab'});
    var tabTitleLink = A({'href': '#'}, get_string('tabs'), tabTitleSpan);
    tabDIV = DIV({'id': 'profiletabswrap', 'class': 'tabswrap'}, H3({'class': 'rd-tab-title'}, tabTitleLink), tabUL);
    var isOpen = 0;
    connect(tabTitleLink, 'onclick', function(e) {
        e.stop();
        if (isOpen == 0) {
            addElementClass(tabDIV, 'expand');
            getFirstElementByTagAndClassName('a', null, tabUL).focus();
        }
        else {
            removeElementClass(tabDIV, 'expand');
        }
        isOpen = 1 - isOpen;
    });

    forEach(fieldsets, function(fieldset) {
        if (hasElementClass(fieldset, 'collapsed')) {
            addElementClass(fieldset, 'safe-hidden');
            removeElementClass(fieldset, 'collapsed');
        }
        else {
            // not collapsed by default, probably was the default one to show
            addElementClass(fieldset.tabLink.parentNode, 'current-tab');
            addElementClass(fieldset.tabLink, 'current-tab');
            fieldset.tabAccessibleText.innerHTML = '(' + get_string('tab') + ' ' + get_string('selected') + ')';
        }
    });

    forEach(legends, function(legend) {
        addElementClass(legend, 'hidden');
    });

    // Remove the top submit buttons
    removeElement('profileform_topsubmit_container');

    // last part is the submit buttons
    appendChildNodes('profileform',
        tabDIV, DIV({'class': 'profile-fieldsets subpage'}, fieldsets), getFirstElementByTagAndClassName('td', null, 'profileform_submit_container').childNodes
    );
    removeElement(
        getFirstElementByTagAndClassName('table', null, 'profileform')
    );

    // Connect events to each form element to check if they're changed and set
    // a dirty flag
    var formDirty = false;
    forEach(getElementsByTagAndClassName(null, null, 'profileform'), function(i) {
        if (i.tagName != 'INPUT' && i.tagName != 'TEXTAREA') return;
        if (!hasElementClass(i, 'text') && !hasElementClass(i, 'textarea')) return;
        connect(i, 'onchange', function(e) {
            formDirty = true;
        });
    });

    // Now unhide the profile form
    hideElement('profile-loading');
    $('profileform').style.position = 'static';
    $('profileform').style.visibility = 'visible';
});

// Add a stylesheet for styling in JS only
// See http://www.phpied.com/dynamic-script-and-style-elements-in-ie/
var styleNode = createDOM('style', {'type': 'text/css'});
var rule = '#profileform { visibility: hidden; position: absolute; top: 0; }';
// Stupid IE workaround
if (document.all && !window.opera) {
    styleNode.styleSheet.cssText = rule;
}
else {
    appendChildNodes(styleNode, rule);
}
appendChildNodes(getFirstElementByTagAndClassName('head'), styleNode);
