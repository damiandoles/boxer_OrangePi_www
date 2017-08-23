/////////////////////////////////////////////////////////////////////////////////////////////////////////
var timeDateTimer = null;
var getMeasurementsTimer = null;
var xhr = null;
var sql = window.SQL;
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function TempControlMode()
{
    var tempMode = document.getElementById("T_01").value;
    var Lvl1 = document.getElementById("Lvl1");
    var Lvl2 = document.getElementById("Lvl2");

    if (tempMode == 0)
    {
        Lvl1.style.display = 'none';
        Lvl2.style.display = 'block';
    }   
    else
    {
        Lvl1.style.display = 'block';
        Lvl2.style.display = 'none';
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function DhcpMode()
{
    var dchpMode    = document.getElementById("N_01").value;
    var ipAddr      = document.getElementById("N_02");
    var subnetMask  = document.getElementById("N_03");
    var gateway     = document.getElementById("N_04");

    if (dchpMode == 0)
    {
        ipAddr.disabled     = true;
        subnetMask.disabled = true;
        gateway.disabled    = true;
    }   
    else
    {
        ipAddr.disabled     = false;
        subnetMask.disabled = false;
        gateway.disabled    = false;
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function IrrigationMode()
{
    var irrigationMode = document.getElementById("I_01").value;
    var Lvl1 = document.getElementById("Lvl1");
    
    if (irrigationMode == 2)
    {
        Lvl1.style.display = 'block';
    }
    else
    {
        Lvl1.style.display = 'none';
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function ResetFactorySettings()
{
    console.log("Settings has been reset to the default!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function ResetDevice()
{
    console.log("Device has been reset!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function SaveNetworkSettings()
{
    var dataError = false;
    var dhcpMode  = parseInt(document.getElementById("N_01").value, 10);
    var ipAddr    = document.getElementById("N_02").value;
    var mask      = document.getElementById("N_03").value;
    var gateway   = document.getElementById("N_04").value;

    switch (dhcpMode)
    {
        case 0:
            //wlacz dhcp
            break;
            
        case 1:
            var ipProper =  ValidateIPaddress(ipAddr);
            var maskProper =  ValidateIPaddress(mask);
            var gatewayProper =  ValidateIPaddress(gateway);

            if (!ipProper)
            {
                dataError = true;
                document.getElementById("N_02Error").innerHTML = "&nbsp;&nbsp;&nbsp;Use proper IP address format (xxx.xxx.xxx.xxx)!";
            }
            else
            {
                document.getElementById("N_02Error").innerHTML = ""; 
            }
            
            if (!maskProper)
            {
                dataError = true;
                document.getElementById("N_03Error").innerHTML = "&nbsp;&nbsp;&nbsp;Use proper subnet mask format (xxx.xxx.xxx.xxx)!";
            }
            else
            {
                document.getElementById("N_03Error").innerHTML = "";                
            }
            
            if (!gatewayProper)
            {
                dataError = true;
                document.getElementById("N_04Error").innerHTML = "&nbsp;&nbsp;&nbsp;Use proper gateway format (xxx.xxx.xxx.xxx)!";                
            }
            else
            {
                document.getElementById("N_04Error").innerHTML = "";
            }
            break;
        
        default:
            dataError = true;
            break;
    }
    
    if (!dataError)
    {
        console.log("Network settings saved!");
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function SaveLightSettings()
{
    var dataError = false;
    var timeOn   = parseInt(document.getElementById("L_01").value, 10);
    var timeOff  = parseInt(document.getElementById("L_02").value, 10);
    var stateOn  = document.getElementById("L_03").checked;
    var stateOff = document.getElementById("L_04").checked;
    var turnOnOffTime = document.getElementById("L_05").value;
    
    if (timeOn < 0 || timeOn > 24 || isNaN(timeOn))
    {
        dataError = true;
        document.getElementById("L_01Error").innerHTML = "&nbsp;&nbsp;&nbsp;Use number between 0 and 24!";
    }
    else
    {
        document.getElementById("L_01Error").innerHTML = "";        
    }
    
    if (timeOff < 0 || timeOff > 24 || isNaN(timeOff))
    {
        dataError = true;
        document.getElementById("L_02Error").innerHTML = "&nbsp;&nbsp;&nbsp;Use number between 0 and 24!";
    }
    else
    {
        document.getElementById("L_02Error").innerHTML = ""; 
    }
    
    if (!stateOn && !stateOff)
    {
        dataError = true;
        document.getElementById("stateError").innerHTML = "&nbsp;&nbsp;&nbsp;Check initial state!";
    }
    else
    {
        document.getElementById("stateError").innerHTML = "";
    }
    
    if (!CheckShortTime(turnOnOffTime))
    {
        dataError = true;
        document.getElementById("L_05Error").innerHTML = "&nbsp;Wrong turn on/off time!";
    }
    else
    {
        document.getElementById("L_05Error").innerHTML = "";
    }
    
    if (!dataError)
    {
        if (timeOn + timeOff === 24)
        {
            // zapis do urzadzenia
            //state: 0 - off, 1 - on
            console.log("Light settings saved!");
        }
        else
        {
            console.log("Sum of times (on+off) must equal 24 hours!");
        }
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function SaveTempFanSettings()
{
    var dataError = false;
    var tempCtrlMode  = document.getElementById("T_01").value;
    var tempMax = parseFloat(document.getElementById("T_02").value, 10);
    var pushFanPower = parseInt(document.getElementById("T_03").value, 10);
    var pullFanPower = parseInt(document.getElementById("T_04").value, 10);
    
    switch (tempCtrlMode)
    {
        case "0":
            if (isNaN(pushFanPower) || pushFanPower < 0 || pushFanPower > 100)
            {
                dataError = true;
                document.getElementById("T_03Error").innerHTML = "&nbsp;&nbsp;&nbsp;Wrong power of push FAN! Please select value from 0 to 100%";
            }
            else
            {
                document.getElementById("T_03Error").innerHTML = "";
            }
            
            if (isNaN(pullFanPower) || pullFanPower < 0 || pullFanPower > 100)
            {
                dataError = true;
                document.getElementById("T_04Error").innerHTML = "&nbsp;&nbsp;&nbsp;Wrong power of pull FAN! Please select value from 0 to 100%";
            }
            else
            {
                document.getElementById("T_04Error").innerHTML = "";
            } 
            break;
        case "1":
            if (isNaN(tempMax) || tempMax < 20 || tempMax > 32)
            {
                dataError = true;
                document.getElementById("T_02Error").innerHTML = "&nbsp;&nbsp;&nbsp;Wrong max temp value! Please select value from 20 to 32°C";
            }
            else
            {
                document.getElementById("T_02Error").innerHTML = "";
            }
            break;
        default:
            break;
    }
    
    if (!dataError)
    {
        // zapis do urzadzenia
        console.log("Temp/Fan settings saved!");
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function SaveIrrigationSettings()
{
    console.log("Irrigation settings saved!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function CalibrateProbe()
{
    var dataError = false;
    var waterProbe  = document.getElementById("P_01").checked;
    var soilProbe = document.getElementById("P_02").checked;
    
    if (!waterProbe && !soilProbe)
    {
        dataError = true;
        document.getElementById("phcalibError").innerHTML = "&nbsp;&nbsp;&nbsp;Select one of available probes!";
    }
    else
    {
        document.getElementById("phcalibError").innerHTML = "";
    }
    
    if (!dataError)
    {
        if (waterProbe)
        {
            console.log("Calibration of water probe started!"); 
        }
        else
        {
            console.log("Calibration of soil probe started!"); 
        }
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function ValidateIPaddress(ipaddress) {  
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
        return (true);  
    }  
    else
        return (false)  
}  
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function CheckShortTime(ATime)
{
    if (ATime && ATime !== "")
    {
        var Pattern = /^(\d{1,2}){2}\:(\d{1,2}){2}$/;
        var A = ATime.match(Pattern);
        if ((A) && (A.length == 3) && (A[1] < 24) && (A[2] < 60) )
            return true;
        else 
            return false;
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function GetIrrigationConfig()
{
    try
    {
        if (window.XMLHttpRequest) //every browsers without IE 
        {
            xhr = new XMLHttpRequest();
        }
        else 
        {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        xhr.open('GET', 'boxer.db', true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function(){
            var uInt8Array = new Uint8Array(xhr.response);
            var db = new sql.Database(uInt8Array);

            var irr_config  = db.exec("SELECT * FROM IRRIGATION_CONFIG");

    //        contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]

            document.getElementById("M_01").value = parseInt(irr_config[0]['values'][0][0]);
            document.getElementById("M_02").value = parseInt(irr_config[0]['values'][0][1]);
            document.getElementById("M_03").value = parseInt(irr_config[0]['values'][0][2]);
            document.getElementById("M_04").value = parseInt(irr_config[0]['values'][0][3]);
            document.getElementById("M_05").value = parseInt(irr_config[0]['values'][0][4]);           
        }
        
        xhr.send(null); 
    }
    catch (err)
    {
        console.log(err);
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function GetLampConfig()
{
    try
    {
        if (window.XMLHttpRequest) //every browsers without IE 
        {
            xhr = new XMLHttpRequest();
        }
        else 
        {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        xhr.open('GET', 'boxer.db', true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function(){
            var uInt8Array = new Uint8Array(xhr.response);
            var db = new sql.Database(uInt8Array);

            var lamp_config  = db.exec("SELECT * FROM LAMP_CONFIG");

    //        contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]

            document.getElementById("L_01").value = parseInt(lamp_config[0]['values'][0][0]);
            document.getElementById("L_02").value = parseInt(lamp_config[0]['values'][0][1]);
            
            var state = parseInt(lamp_config[0]['values'][0][2]);
            
            switch (state)
            {
            case 0:
                document.getElementById("L_03").disabled = true;
                document.getElementById("L_04").checked = true;
                break;
                
            case 1:
                document.getElementById("L_03").checked = true;
                document.getElementById("L_04").disabled = true;                
                break;
                
            default:
                break;
            }
            
            document.getElementById("L_05").value = lamp_config[0]['values'][0][3]; 
            document.getElementById("L_06").value = parseInt(lamp_config[0]['values'][0][4]);
            document.getElementById("L_07").value = parseInt(lamp_config[0]['values'][0][5]);
        }
        
        xhr.send(null); 
    }
    catch (err)
    {
        console.log(err);
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function GetTempFanConfig()
{
    try
    {
        if (window.XMLHttpRequest) //every browsers without IE 
        {
            xhr = new XMLHttpRequest();
        }
        else 
        {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        xhr.open('GET', 'boxer.db', true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function(){
            var uInt8Array = new Uint8Array(xhr.response);
            var db = new sql.Database(uInt8Array);

            var temp_fan_config  = db.exec("SELECT * FROM TEMP_FAN_CONFIG");

    //        contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]

            document.getElementById("T_01").value = parseInt(temp_fan_config[0]['values'][0][0]);
            document.getElementById("T_04").value = parseInt(temp_fan_config[0]['values'][0][1]);
            document.getElementById("T_03").value = parseInt(temp_fan_config[0]['values'][0][2]);
            document.getElementById("T_02").value = parseFloat(temp_fan_config[0]['values'][0][3]);
            TempControlMode();
        }
        
        xhr.send(null); 
    }
    catch (err)
    {
        console.log(err);
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function GetAdvancedConfig()
{
    try
    {
        if (window.XMLHttpRequest) //every browsers without IE 
        {
            xhr = new XMLHttpRequest();
        }
        else 
        {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        xhr.open('GET', 'boxer.db', true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function(){
            var uInt8Array = new Uint8Array(xhr.response);
            var db = new sql.Database(uInt8Array);

            var advanced_config  = db.exec("SELECT * FROM ADVANCED_CONFIG");

    //        contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]

            document.getElementById("M_01").value = parseInt(advanced_config[0]['values'][0][0]);
            document.getElementById("M_02").value = parseInt(advanced_config[0]['values'][0][1]);
            document.getElementById("M_03").value = parseInt(advanced_config[0]['values'][0][2]);
            document.getElementById("M_04").value = parseInt(advanced_config[0]['values'][0][3]);
            document.getElementById("M_05").value = parseInt(advanced_config[0]['values'][0][4]);
            document.getElementById("M_06").value = parseFloat(ph_meas[0]['values'][0][0]);
            document.getElementById("M_07").value = parseFloat(ph_meas[0]['values'][0][1]);
            document.getElementById("M_08").value = basic_meas[0]['values'][0][5];            
        }
        
        xhr.send(null); 
    }
    catch (err)
    {
        console.log(err);
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function GetMeasurements()
{
    try
    {
        if (window.XMLHttpRequest) //every browsers without IE 
        {
            xhr = new XMLHttpRequest();
        }
        else 
        {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        xhr.open('GET', 'boxer.db', true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function(){
            var uInt8Array = new Uint8Array(xhr.response);
            var db = new sql.Database(uInt8Array);

            var basic_meas  = db.exec("SELECT * FROM BASIC_MEAS ORDER BY TIMELOCAL DESC Limit 1");
            var ph_meas     = db.exec("SELECT * FROM PH_MEAS ORDER BY TIMELOCAL DESC Limit 1");

    //        contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]

            document.getElementById("M_01").value = parseInt(basic_meas[0]['values'][0][0]);
            document.getElementById("M_02").value = parseInt(basic_meas[0]['values'][0][1]);
            document.getElementById("M_03").value = parseInt(basic_meas[0]['values'][0][2]);
            document.getElementById("M_04").value = parseInt(basic_meas[0]['values'][0][3]);
            document.getElementById("M_05").value = parseInt(basic_meas[0]['values'][0][4]);
            document.getElementById("M_06").value = parseFloat(ph_meas[0]['values'][0][0]);
            document.getElementById("M_07").value = parseFloat(ph_meas[0]['values'][0][1]);
            document.getElementById("M_08").value = basic_meas[0]['values'][0][5];            
        }
        
        xhr.send(null); 
    }
    catch (err)
    {
        console.log(err);
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function OnAdvancedLoad()
{
    GetAdvancedConfig();
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function OnIrrigationLoad()
{
    GetIrrigationConfig();
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function OnTempFanLoad()
{
    GetTempFanConfig();
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function OnIndexLoad()
{
    TimeDateUpdate();
    GetMeasurements();
    timeDateTimer = setInterval('TimeDateUpdate()', 1000 );
    getMeasurementsTimer = setInterval('GetMeasurements()', 3000 );
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function OnLampLoad()
{
    GetLampConfig();
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function LightStateCheckBox()
{
    var stateOn  = document.getElementById("L_03");
    var stateOff = document.getElementById("L_04");   
    
    if (stateOn.checked)
    {
        stateOff.disabled = true;
    }
    else
    {
        stateOff.disabled = false;
    }
    
    if (stateOff.checked)
    {
        stateOn.disabled = true;
    }
    else
    {
        stateOn.disabled = false;
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function PhCalibCheckBox()
{
    var waterProbe = document.getElementById("P_01");
    var soilProbe  = document.getElementById("P_02");   
    
    if (waterProbe.checked)
    {
        soilProbe.disabled = true;
    }
    else
    {
        soilProbe.disabled = false;
    }
    
    if (soilProbe.checked)
    {
        waterProbe.disabled = true;
    }
    else
    {
        waterProbe.disabled = false;
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function TimeDateUpdate()
{
    var dateTimeObj = new Date();
    
    var hoursStr = dateTimeObj.getHours();
    if (hoursStr < 10) hoursStr = "0" + hoursStr;
    
    var minutesStr = dateTimeObj.getMinutes();
    if (minutesStr < 10) minutesStr = "0" + minutesStr;
    
    var secondsStr = dateTimeObj.getSeconds();
    if (secondsStr < 10) secondsStr = "0" + secondsStr;
    
    var timeString = hoursStr + ":" + minutesStr + ":" + secondsStr;

    var monthDayStr = dateTimeObj.getDate();
    if (monthDayStr < 10) monthDayStr = "0" + monthDayStr;
    
    var monthStr = (dateTimeObj.getMonth() + 1);
    if (monthStr < 10) monthStr = "0" + monthStr;
       
    var dateString = monthDayStr + "/" + monthStr + "/" + dateTimeObj.getFullYear();
 
    document.getElementById("T_01").value = timeString;
    document.getElementById("T_02").value = dateString;
}