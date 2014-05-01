var oudomain = window.location.hostname;
var idx = oudomain.indexOf(".");
var mdomain = oudomain.slice(idx,oudomain.length);	

function ougetCookie(c_name) {
    
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }

    ousetCookie("ou_cookie_policy", "notified", 365, mdomain);
}


function getCookiePolicyTranslation() {
    var _cookiepolicy_copy = new Array();

    // Determine if english or welsh text should be displayed

    if (document.body.className.indexOf('cymraeg') >= 0) {
        _cookiepolicy_copy['_cookiepolicy_title'] = "Cwcis ar ein gwefan";
        _cookiepolicy_copy['_cookiepolicy_body'] = "Rydym yn defnyddio cwcis i sicrhau bod ein gwefannau yn gweithio'n effeithiol ac i wella eich profiad y defnyddiwr. Os byddwch yn parhau i ddefnyddio'r safle, byddwn yn tybio eich bod yn fodlon gyda hyn. Fodd bynnag, gallwch newid eich gosodiadau cwcis ar unrhyw adeg.";
        _cookiepolicy_copy['_cookiepolicy_button'] = "parhau";
    }
    else {
        _cookiepolicy_copy['_cookiepolicy_title'] = "Cookies on our website";
        _cookiepolicy_copy['_cookiepolicy_body'] = "We use cookies to make sure our websites work effectively and to improve your user experience.  If you continue to use this site we will assume that you are happy with this. However, you can change your cookie settings at any time.";
        _cookiepolicy_copy['_cookiepolicy_button'] = "Continue";
    }

    return _cookiepolicy_copy;
}

function displayNotification(c_action) {

    // Get Cookie policy translation based on class
    var _translation = getCookiePolicyTranslation();

    var message = '<div id="int-cookies-bar" class="int-cookies-bar int-active">';
    message = message + '<div class="interaction">';
    message = message + '<div class="int-container">';
    message = message + '<div class="int-row">';
    message = message + '<div class="int-grid12">';
    message = message + '<h3>' + _translation['_cookiepolicy_title'] + '</h3>';
    message = message + '</div>';
    message = message + ' </div>';
    message = message + '<div class="int-row">';
    message = message + '<div class="int-grid10">';
    message = message + '<p>';
    message = message + _translation['_cookiepolicy_body'];
    message = message + '</p>';
    message = message + '</div>';
    message = message + '<div class="int-grid2">';
    message = message + '<a href="#" onclick="JavaScript:oudoAccept();" class="int-button" id="int-cookies-bar-button" role="button">' + _translation['_cookiepolicy_button'] + '</a>';
    message = message + '</div>';
    message = message + '</div>';
    message = message + '</div>';
    message = message + '</div>';
    message = message + '</div>';

    document.writeln(message);
}

function oudoAccept() {
    ousetCookie("ou_cookie_policy", "continue", 365, mdomain);
    location.reload(true);
}

function ousetCookie(c_name, value, exdays, domain) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString() + "; path=/");
    document.cookie = c_name + "=" + c_value + ";domain=" + domain;
}

function oucheckCookie(_cookieName) {
    var cookieChk = ougetCookie(_cookieName);
    return cookieChk;
}

function ouCookiePolicyDisplayNotification() {

  var cookieName = "ou_cookie_policy";
  var cookieSAMS = "SAMSsession";
  var cookie2SAMS = "SAMS2session";

  var cookieChk = oucheckCookie(cookieName);
  var samsCookie1 = oucheckCookie(cookieSAMS);
  var samsCookie2 = oucheckCookie(cookie2SAMS);

  if(samsCookie1 != null && samsCookie1 != ""){
    ousetCookie("ou_cookie_policy", "continue", 365, mdomain); // set the cookie to expire in a year.
  }
  else {
    if (cookieChk != null && cookieChk != "notified") {
      ousetCookie(cookieName, cookieChk, 365, mdomain); // set the cookie to expire in a year.
    }
    else {
      displayNotification();          
    }
  }
}

// Choose wheather to diplay cookie policy notification
ouCookiePolicyDisplayNotification();
