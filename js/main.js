

//this function will print the contents of an object
var printObj = function(o){
    var str='';

    for(var p in o){
        if(typeof o[p] == 'string'){
            str+= p + ': ' + o[p]+'; ';
        }else{
            str+= p + ': { ' + printObj(o[p]) + '}';
        }
    }

    return str;
}

//initial login screen
//alert(JSON.stringify(YOUR_OBJECT_HERE, null, 4));
function state0()
{
    //state 0//////////////////////////////////////////////////////////////////////////////////////////////////////
    //this is a simple key only login page
    //setup the page
    $(".messageField1").text("please enter your pin");
    $(".numpad1Screen").attr("placeholder"," Pin #");
    $(".button1").addClass("scanCard").text("Scan card");
    $(".button2").addClass("submit_pin").text("Submit Pin");
    $(".button4").addClass("testButton").text("Test Button");

    ////all the clickable stuff
    /*$('.testButton').bind('click', function() {
        //do some things

        $(".messageField1").text("test button clicked");
        model.updateViewFromModel();
        $(this).unbind('click', arguments.callee); //unbind *just this handler*
    });*/
    //$(".testButton").unbind("click");

    $('.testButton').on('click.msgBtn', function() {
        //do some things
        //$("messageField1").text(JSON.stringify(data, null, 4));
        //alert(JSON.stringify(something, null, 4));
        var someObj = {
            something : "somethingWords",
            something2 : "something2Words"
        }

        $('.testButton').off('.msgBtn');
    })

    //if the reload button is clicked
    $(".reload").on('click.msgBtn', function() {
        $(".reload").off('.msgBtn');

        location.reload();
    });

    ////// submit pin button///////
    $(".submit_pin").click(function()
    {
        var results;
        var thisPin = model.numpadData;

        $.ajax({
            url: '/',
            type: 'GET',
            data: {
                Function : "Cmd",
                tag : "panel",
                type : "set",
                name : "wkp",
                value : thisPin,
                sid : "10192001"
            },
            dataType: 'json',
            success: function (data) {
                //$("#messaging").val(data.panel.cmd);
                if (data.panel.cmd == "ack") {
                    //$(".messageField1").text("Checking for reservation data. Stand by...");
                    $(".messageField1").text(printObj(data));

                    setTimeout(function(){process_authorization(thisPin);
                    }, 1000);
                }
                else {
                    //if incorrect pin, tell the user to re-enter their pin
                    $(".numpadScreen").css("background-color", "#FF7785");
                    $(".messageField1").text("Incorrect pin. Please wait...");
                    //setTimeout(state0(), 5000);
                }
            }
        });

        $(".numpadScreen").val('');

    });

    //if the reload button is clicked
    $(".scanCard").on('click.msgBtn', function() {
        $(".scanCard").off('.msgBtn');

    });
}

//no override mode
function state1()
{
    //initilize login via card page
    $(".messageField1").text("Please login using the credentials given");
    $(".button1").text("superState9999").attr('class', 'msgBtn button1 superState');
    $(".button2").hide();
    $(".button3").hide();
    $(".button4").hide();

    //clickable elements
    $(".button1").on('click.msgBtn', function() {
        $(".button1").off('.msgBtn');
        state9999();
    });
}

//pin only mode
function state2()
{
    $(".messageField1").text("please login using the pin pad. Press OK when finished.");

    $(".button1").text("superState").attr('class', 'msgBtn button1 superState');
    $(".button2").hide();
    $(".button3").hide();
    $(".button4").hide();

    //clickable elements
    $(".button1").on('click.msgBtn', function() {
        $(".button1").off('.msgBtn');
        state9999();
    });
}

/////a super function to do random testings
function state9999()
{
    //initilize login via card page
    $(".messageField1").text("reload everything or enter a state number into the pinpad and click the command button");
    $(".button1").text("back").attr('class', 'msgBtn button1 back');
    $(".button2").text("got to state1");
    $(".button3").text("super command");
    $(".button4").text("reload everything");

    ///the clickable stuff
    // Delegate events under the ".msgBtn" namespace
    $(".button1").on('click.msgBtn', function() {
        var results;
        var thisPin = model.numpadData;

        $.ajax({
            url: '/',
            type: 'GET',
            data: {
                Function : "Cmd",
                tag : "panel",
                type : "set",
                name : "wkp",
                value : thisPin,
                sid : "10192001"
            },
            dataType: 'json',
            success: function (data) {
                //$("#messaging").val(data.panel.cmd);
                if (data.panel.cmd == "ack") {
                    $(".messageField1").text("Checking for reservation data. Stand by...");

                    setTimeout(function(){process_authorization(thisPin);
                    }, 1000);
                }
                else {
                    //if incorrect pin, tell the user to re-enter their pin
                    $(".numpadScreen").css("background-color", "#FF7785");
                    $(".messageField1").text("Incorrect pin. Please wait...");
                    //setTimeout(state0(), 5000);
                }
            }
        });

        $(".numpadScreen").val('');
        state1();
    });

    /////could also use $(".button2").one("click", function(){};?????? not really sure
    $(".button2").on("click.msgBtn", function(){
        // Remove event handlers in the ".msgBtn" namespace
        $(".button2").off('.msgBtn');
        var command = model.getNumpadData();
        if(command == 1)
        {
            //switch off all the buttons
            state9999Destroy();
            state1();
        }
        else if(command == 2)
        {
            state9999Destroy();
            state2();
        }
    });
    /////could also use $(".button2").one("click", function(){};?????? not really sure
    $(".button3").on("click.msgBtn", function(){
        // Remove event handlers in the ".msgBtn" namespace
        $(".button2").off('.msgBtn');
        location.reload();
    });
    /////could also use $(".button2").one("click", function(){};?????? not really sure
    $(".button4").on("click.msgBtn", function(){
        // Remove event handlers in the ".msgBtn" namespace
        $(".button4").off('.msgBtn');
        location.reload();
    });

}

function state9999Destroy()
{
    $(".button1").off('.msgBtn');
    $(".button2").off('.msgBtn');
    $(".button3").off('.msgBtn');
    $(".button4").off('.msgBtn');
}

function numpad()
{
    ///////////numpad stuff///////
    var $write = $('.numpad1Screen');
    var $OK = false;

    $('.numpad1 li').click(function() {
        var $this = $(this);
        var character = $this.html(); // If it's a lowercase letter, nothing happens to this variable

        character = $('span:visible', $this).html();

        if($this.hasClass('symbol')){
            // Add the character
            $write.val($write.val() + character);
            model.numpadData = $write.val();
        }
        else if ($this.hasClass('Clr')) {// clear the input box of everything
            $write.val('');
            character ='';
            model.numpadData = '';
        }
        else if($this.hasClass('OK')) {//go to the next page
            model.OKTrueFalse = true;
            $OK = true;
        }

    });
    /////////end numpad stuff//////
}

///starting point
$(function(){
    //update the view and the model to what the login screen should be like
    //login_screen_init();

    //go to the no override login state
    state0();

    //process_authorization();
    numpad();

    //////////silence button//////////////////////////
    $(".silence_button").click(function() {
        $.ajax({
            url: '/',
            type: 'GET',
            data: {
                Function: "Cmd",
                tag: "panel",
                type: "set",
                name: "bz",
                value: "off",
                sid: "10192001"
            },
            dataType: 'json',
            success: function (data) {
                $(".messageField1").text(printObj(data));
            }

        });

    });

    //ANIMATE IMAGES WHEN THEY ARE PRESSED
    $(".feature_image").click(function () {
        $(this).animate({
            width: "75px",
            height: "75px"
        }, 100 );

        $(this).animate({
            width: "80px",
            height: "80px"
        }, 100 );

    });

});

function door_audit(thisPin)
{

}

//stuff from from server
function process_authorization(thisPin)
{
    // GET USER AND KEY DATA
    $.ajax({
        url : '/',
        type : 'GET',
        data : {
            Function: "Cmd",
            tag: "useraudit",
            type: "uresv",
            userid: "current",
            sid: "10192001"
        },

        dataType: 'json',
        success: function(data){
            var login_verify = data.useraudit.cmd;

            if (login_verify == "nack") {
                //incorrect pin
                return false;
            }
            else {
                //update the user info in the the model
                model.updateUserAuditData(data);

                var firstname = data.useraudit.fname;
                var lastname = data.useraudit.lname;
                var permKeys = data.useraudit.pkeys;
                var resKeys = data.useraudit.rpos;
                var resStart = data.useraudit.sresv;
                var resEnd = data.useraudit.eresv;
                //alert("test"+data.toSource());
                //alert(
                var theMessage;

                theMessage = "Authorized: " + lastname + ", " + firstname + "\n\n";

                if (resStart != "null") {
                    theMessage = theMessage + "Reserved key in position " + resKeys + "\n\n";
                }
                if (permKeys != "") {
                    theMessage = theMessage + "Permanent issued keys " + permKeys;
                }

                model.messageFieldData = theMessage;
                $(".messageField1").text("something" + printObj(data));
                // + JSON.stringify(data)
                //+JSON.stringify(data, null, 4)

            }

        }

    });

    // OBTAIN THE AUTHORIZATION TIME
    $.ajax({

        url: '/',
        type: 'GET',
        data: {
            Function: "Cmd",
            tag: "panel",
            type: "get",
            name: "asto",
            sid: "10192001"
        },
        dataType: 'json',
        success: function (data) {

            model.authTime = data.panel.asto;

            //$("#panel_buffer2").val(data.panel.asto);
            //var auth_time = $("#panel_buffer2").val()
            // ;
            var auth_time = model.authTime;
            var auth_time_ms = auth_time * 1000;
            var startTime = new Date().getTime();
            var interval = setInterval(function(){
                if(new Date().getTime() - startTime > auth_time_ms){
                    clearInterval(interval);
                    $(".submit_pin").attr("disabled", true);
                    $(".messageField1").text("Checking for reservation data. Stand by...");

                    return;
                }

            }, 1000);

        }

    });

}

var modelToo = Backbone.Model.extend()
{

}

///a model/messaging center that can be used to see what the rest of the system is looking like
// and to hold data about the system
var model = {
    //eval();//this function can evaluate javascript pumped into it
    stateNum : 0,
    stateDescription : "initial login screen",

    messageFieldData : "please enter your pin or press the scan card button TEST",
    button1Text : "button1",
    button2Text : "button2",
    button3Text : "button3",
    button4Text : "button4",

    numpadData : "",
    OKTrueFalse    : false,
    OKButtonData : "submit_pin",

    //user audit data
    firstName : "",
    lastName : "",
    permKeys : "",
    resKeys : "",
    resStart : "",
    resEnd : "",

    authTime : "",



    getNumpadData : function(){
        return this.numpadData;
    },

    updateUserAuditData : function(data){
        this.firstName = data.useraudit.fname;
        this.lastName = data.useraudit.lname;
        this.permKeys = data.useraudit.pkeys;
        this.resKeys = data.useraudit.rpos;
        this.resStart = data.useraudit.sresv;
        this.resEnd = data.useraudit.eresv;
    },

    updateModelFromView : function(){
        this.messageFieldData = $(".messageField1").text();
        this.button1Text = $(".button1").text();
        this.button2Text = $(".button2").text();
        this.button3Text = $(".button3").text();
        this.button4Text = $(".button4").text();

        this.numpadData = $(".numpad1Screen").val();
    },

    updateViewFromModel : function(){

        $(".messageField1").text(this.messageFieldData);
        $(".button1").text(this.button1Text);
        $(".button2").text(this.button2Text);
        $(".button3").text(this.button3Text);
        $(".button4").text(this.button4Text);
        $(".numpad1Screen").val(numpadData);

        $(".button1").off('.msgBtn');
        $(".button2").off('.msgBtn');
        $(".button3").off('.msgBtn');
        $(".button4").off('.msgBtn');
    },

    resetAllDefaults : function(){
        $(".messageField1").text("please enter your pin or press the scan card button");
        $(".button1").show().text("button1")
            .attr('class', 'msgBtn button1');
        $(".button2").show().text("button2")
            .attr('class', 'msgBtn button2');
        $(".button3").show().text("button3")
            .attr('class', 'msgBtn button3');
        $(".button4").show().text("button4")
            .attr('class', 'msgBtn button4');
        $(".numpad1Screen").val("")
            .attr('placeholder', '');
    }

};