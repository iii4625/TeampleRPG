var _DEBUG = true;
var classData = classDataJson[0];
if(!_DEBUG)
{
    var request = new XMLHttpRequest();
    request.open("GET", "https://raw.githubusercontent.com/AINukeHere/TeampleRPG/main/data/images/class_info.json", false);
    request.send(null)
    classData = JSON.parse(request.responseText);
}

var classJobSectionDiv = document.getElementById("ClassAndJobs").getElementsByTagName('div')[0];
//static
innerHTML_str = "\
<div id='classTable' class='classTable'>";
    for(var i =0; i < classData.classes.length; ++i){
        innerHTML_str += "\
        <a class='classProfile' onclick='onClickClass(false,"+i+")' onmousemove='showClassPopupInfo("+i+")' onmouseout='hideClassPopupInfo(this)'>\
        <img class='classProfileImage' src=./data/images/"+classData.classes[i].image+"><br><span>"+classData.classes[i].name+"</span><br>";
        if(classData.classes[i].nickname)
            innerHTML_str += "<span>(별칭:"+classData.classes[i].nickname+")</span><br>";
        innerHTML_str += "</a>";
    }
    innerHTML_str += "\
    <div id='classPopupInfo' class='classPopupInfo'>\
        <div>\
            캐릭터를 설명하는 중...\
        </div\
        <br>\
        <img src='data/images/dummy.png'>\
    </div>\
</div>\
<div id='classView'></div>\
<div id='jobView'></div>\
<div id='skillPopupInfo' class='skillPopupInfo'>\
    <img src='data/images/S_Skill_Cost.png'>\
</div>";
classJobSectionDiv.innerHTML = innerHTML_str;

function setPopupInfoPosition(event)
{
    var classPopupInfo = document.getElementById("classPopupInfo");
    var skillPopupInfo = document.getElementById("skillPopupInfo");
    var offset = 10;
    var leftValue = (event.pageX+offset).toString()+"px";
    var topValue = (event.pageY+offset).toString()+"px";
    skillPopupInfo.style.left = leftValue;
    if(event.pageX < 960){
        classPopupInfo.style.left=leftValue;
    }
    else{
        classPopupInfo.style.left=(event.pageX-offset - 450).toString()+"px";
        classPopupInfo.style.right=(event.pageX-offset).toString()+"px";
    }
    skillPopupInfo.style.top = topValue;
    classPopupInfo.style.top = topValue;
}
function toggleclassTable()
{
    var classTable = document.getElementById("classTable");
    if (classTable.style.display == "none")
        classTable.style.display = "grid";
    else
        classTable.style.display = "none";
}
function showClassPopupInfo(classIdx)
{
    var classPopupInfo = document.getElementById("classPopupInfo");
    classPopupInfo.style.display="inline";

    var classInfo = classData.classes[classIdx];
    var spec_str1=getSpecString(classInfo.spec1);
    var spec_str2=getSpecString(classInfo.spec2);
    var spec_str3=getSpecString(classInfo.spec3);
    
    var innerHTML_str = "\
    <div>\
        <div><span class='specName DPTEXT_07'>파괴력</span><span class='specStars DPTEXT_08'>"+spec_str1+"</span></div>\
        <div><span class='specName DPTEXT_07'>내구력</span><span class='specStars DPTEXT_08'>"+spec_str2+"</span></div>\
        <div><span class='specName DPTEXT_07'>기동성</span><span class='specStars DPTEXT_08'>"+spec_str3+"</span></div>\
        <span class='explanation DPTEXT_04'>"+classInfo.explanation+"</span>\
    </div>\
    <img src='data/images/"+classInfo.image+"'>\
    ";
    if(classInfo.unitSpec != null){
        innerHTML_str += getUnitSpecInnerHTML(classIdx);
    }
    classPopupInfo.innerHTML = innerHTML_str;
}
function hideClassPopupInfo(obj)
{
    var classPopupInfo = document.getElementById("classPopupInfo");
    classPopupInfo.style.display="none";
}
function showSkillPopupInfo(skillCommand, isBuilding)
{
    var skillPopupInfo = document.getElementById("skillPopupInfo");
    skillPopupInfo.style.display="inline";
    switch(skillCommand)
    {
        case 'o':
        case 's':
        case 'v':
            skillPopupInfo.getElementsByTagName("img")[0].src = "data/images/small_"+skillCommand+"_skill_Cost.png";
            break;
        default:
            if(isBuilding)
                skillPopupInfo.getElementsByTagName("img")[0].src = "data/images/"+skillCommand+"_building_Cost.png";
            else
                skillPopupInfo.getElementsByTagName("img")[0].src = "data/images/"+skillCommand+"_Skill_Cost.png";
            break;
    }
}
function hideSkillPopupInfo()
{
    var skillPopupInfo = document.getElementById("skillPopupInfo");
    skillPopupInfo.style.display="none";
}

function onClickClass(isURL, classIdx)
{
    console.log("onClickClass("+isURL+","+classIdx + ")");
    var classInfo = classData.classes[classIdx];
    var classView = document.getElementById("classView");
    var jobView = document.getElementById("jobView");
    jobView.style.display="none";
    classView.style.display="block";

    var spec_str1=getSpecString(classInfo.spec1);
    var spec_str2=getSpecString(classInfo.spec2);
    var spec_str3=getSpecString(classInfo.spec3);
    

    var innerHTML_str = "\
    <img class='classProfileImage' src=data/images/"+classData.classes[classIdx].image+"><br>\
        <span class='specName DPTEXT_07'>파괴력</span><span class='specStars DPTEXT_08'>"+spec_str1+"</span><br>\
        <span class='specName DPTEXT_07'>내구력</span><span class='specStars DPTEXT_08'>"+spec_str2+"</span><br>\
        <span class='specName DPTEXT_07'>기동성</span><span class='specStars DPTEXT_08'>"+spec_str3+"</span><br>\
    <span class='explanation DPTEXT_04'>"+classData.classes[classIdx].explanation+"</span>\
    <br>";
    if(classIdx > 13){
        innerHTML_str += "<br>";
        innerHTML_str += "<div style='background-color:black;'>";
        innerHTML_str += "<div id='missionObjBtn' class='missionObjBtn' onclick='onClickMissionObjBtn(this)'>임무 목표(<span>J</span>)<img src=''></img></div>";
        innerHTML_str += "<div id='missionObjViewer' class='missionObjViewer'>\
        " + getMissionObjInnerHTML(classIdx, -1) + "\
        </div></div>";
    }
    innerHTML_str += "\
    <div class='skillViewer'>\
    <div class='skillViewerTitle'><span>스킬</span></div>\
    "+getSkillInnerHTML(classInfo.skills)+"\
    </div>\
    ";
    if(classData.classes[classIdx].buildings != null){
        innerHTML_str+="<div class='availableBuildingViewer'>\
        <div class='availableBuildingViewerTitle'><span>사용가능한 건물</span></div>\
        "+getAvailableBuildingViewer(classData.classes[classIdx].buildings)+"\
        </div>";
    }
    if(classInfo.jobs != null){
        var job1_abstract_str = getJobAbstractString(classInfo.jobs[0]);
        var job2_abstract_str = getJobAbstractString(classInfo.jobs[1]);
        innerHTML_str += "\
        <div class='jobSelect'>\
            <div class='jobSelectionTitle'><span>직업 선택지</span></div>\
            <div style='padding:5px;'>\
                <div class='jobSelectMessage DPTEXT_04'>두 직업 중 하나를 선택하세요</div><br>\
                <div class='jobExplanation'>\
                    <div class='job1View'>\
                        <span class='DPTEXT_07'>" + classInfo.jobs[0].name+ "</span><span class='DPTEXT_1E'> ("+classInfo.jobs[0].nickname+")</span><br>\
                        " + job1_abstract_str;
                        for(var explanationIdx = 0; explanationIdx < classInfo.jobs[0].explanation.length; ++explanationIdx){
                            innerHTML_str+="<div style='color:rgb(208,208,213);'>\
                            " + classInfo.jobs[0].explanation[explanationIdx] + "\
                            </div>";
                        }
                        innerHTML_str+="\
                    </div>\
                    <div class='job2View'>\
                        <span class='DPTEXT_07'>" + classInfo.jobs[1].name+ "</span><span class='DPTEXT_1E'> ("+classInfo.jobs[1].nickname+")</span><br>\
                        " + job2_abstract_str;
                        for(var explanationIdx = 0; explanationIdx < classInfo.jobs[1].explanation.length; ++explanationIdx){
                            innerHTML_str+="<div style='color:rgb(208,208,213);'>\
                            " + classInfo.jobs[1].explanation[explanationIdx] + "\
                            </div>";
                        }
                        innerHTML_str+="\
                    </div>\
                </div>\
                <div class ='jobSelection'>\
                <img style='align-self:center;justify-self: center; width:144px; height:144px;' src='data/images/jobSelect1.png'>\
                <img style='align-self:center;justify-self: center; width:144px; height:144px;' src='data/images/jobSelect2.png'>\
                <button class='job1SelectButton' onclick='onSelectJob(false,"+classIdx+", 0)'>선택1</button>\
                <button class='job2SelectButton' onclick='onSelectJob(false,"+classIdx+", 1)'>선택2</button>\
                </div>\
            </div>\
        </div>\
        ";
    }
    
    //html DOM 수정
    classView.innerHTML= innerHTML_str;
    location.href ="#classView";
    location.href += "&?classIdx="+classIdx;
}
function onSelectJob(isURL, classIdx, jobIdx)
{
    console.log("onSelectJob("+isURL+","+classIdx + ", " + jobIdx + ")");
    var jobView = document.getElementById("jobView");
    var innerHTML_str = "<div style='background-color:black;'>";
    innerHTML_str += "<div id='missionObjBtn' class='missionObjBtn' onclick='onClickMissionObjBtn(this)'>임무 목표(<span>J</span>)<img src=''></img></div>";
    innerHTML_str += "<div id='missionObjViewer' class='missionObjViewer'>\
    " + getMissionObjInnerHTML(classIdx, jobIdx) + "\
    </div></div>";
    innerHTML_str += "<div class='skillViewer'>\
    <div class='skillViewerTitle'><span>스킬</span></div>\
    "+getSkillInnerHTML(classData.classes[classIdx].jobs[jobIdx].skills)+"\
    </div>";

    if(classData.classes[classIdx].jobs[jobIdx].buildings != null){
        innerHTML_str+="<div class='availableBuildingViewer'>\
        <div class='availableBuildingViewerTitle'><span>사용가능한 건물</span></div>\
        "+getAvailableBuildingViewer(classData.classes[classIdx].jobs[jobIdx].buildings)+"\
        </div>";
    }
    jobView.innerHTML = innerHTML_str;
    jobView.style.display = "block";



    location.href ="#jobView";
    location.href += "?classIdx="+classIdx+"&jobIdx="+jobIdx;
}
function getSpecString(starNum)
{
    var spec_str = "";
    for(var i = 5, spec = starNum; i > 0 || spec > 0; --i,--spec){
        spec_str += (spec > 0) ? "★" : "☆";
    }
    return spec_str;
}
function getJobAbstractString(jobInfo)
{
    var job_abstract_str = "<div>";
    job_abstract_str += "<span style='color:white;'>"+jobInfo.battleType+"</span>";
    job_abstract_str += "<span style='color:cyan;'>│</span>";
    job_abstract_str += "<span style='color:white;'>"+jobInfo.role+"</span>";
    job_abstract_str += "<span style='color:cyan;'>│</span>";
    job_abstract_str += "<span style='color:white;'>난이도: </span>";
    switch(jobInfo.difficulty){
        case '쉬움':
            job_abstract_str += "<span style='color:yellow;'>"+jobInfo.difficulty+"</span>";
            break;
        case '보통':
            job_abstract_str += "<span style='color:rgb(44, 180, 148);'>"+jobInfo.difficulty+"</span>";
            break;
        case '어려움':
        case '매우 어려움':
            job_abstract_str += "<span style='color:rgb(255,5,5);;'>"+jobInfo.difficulty+"</span>";
            break;
        default:
            console.log("unknown difficulty:"+jobInfo.difficulty);
            break;
    }
    job_abstract_str += "</div>";
    return job_abstract_str;
}
function getMissionObjInnerHTML(classIdx, jobIdx){
    console.log("getMissionObjInnerHTML("+classIdx+", "+jobIdx+");");
    var innerHTML_str = "";
    switch(classIdx){
        case 14:
        case 15:
            var jobInfo = classData.classes[classIdx];
            break;
        default:
            var jobInfo = classData.classes[classIdx].jobs[jobIdx];
            break;
    }
    innerHTML_str += "<div><span class='DPTEXT_01'>임무 목표</span></div>";
    innerHTML_str += "<div class='missionObjContent'><span class='DPTEXT_1F'>"+jobInfo.name+"</span>\
    <span class='DPTEXT_1C'>스킬명 색상구분 (</span>\
    <span class='DPTEXT_08'>공격형</span>\
    <span class='DPTEXT_03'>소환형</span>\
    <span class='DPTEXT_0E'>유틸기</span>\
    <span class='DPTEXT_07'>회복형</span>\
    <span class='DPTEXT_1C'>)</span>\
    </div>";
    for(var i = 0; i < jobInfo.skills.length; ++i)
    {
        var skillInfo = jobInfo.skills[i];
        innerHTML_str += "\
        <div class='missionObjContent'>";
        
        switch(skillInfo.type){
            case "공격형":
                innerHTML_str += "<span class='DPTEXT_08'>" + skillInfo.name +"</span>\
                <span class='DPTEXT_1F'> - </span>";
                break;
            case "소환형":
                innerHTML_str += "<span class='DPTEXT_03'>" + skillInfo.name +"</span>\
                <span class='DPTEXT_1F'> - </span>";
                break;
            case "유틸기":
                innerHTML_str += "<span class='DPTEXT_0E'>" + skillInfo.name +"</span>\
                <span class='DPTEXT_1F'> - </span>";
                break;
            case "회복형":
                innerHTML_str += "<span class='DPTEXT_07'>" + skillInfo.name +"</span>\
                <span class='DPTEXT_1F'> - </span>";
                break;
            default:
                console.log("unknown skill type:"+skillInfo.type);
                break;
        }
        innerHTML_str += "<span class='skillCommand DPTEXT_04'>"+skillInfo.command + "</span></div>";
    }
    innerHTML_str += "<div class='missionObjPrevBtn' onclick='onClickMissionObjPrevBtn()'>이전 (<span>Esc</span>)</div>";
    return innerHTML_str;
}
function getSkillInnerHTML(skills){
    var innerHTML_str = "";
    for(var i = 0; i < skills.length; ++i)
    {
        var skillInfo = skills[i];
        innerHTML_str += "\
        <table class='skillContent'>\
        <tr>\
            <td>";
            for(var cmdIdx = 0; cmdIdx < skillInfo.command.length; ++cmdIdx)
            {
                switch(skillInfo.command[cmdIdx]){
                    case "S":
                    case "C":
                    case "A":
                    case "O":
                    case "P":
                    case "Z":
                    case "D":
                    case "T":
                    case "K":
                        innerHTML_str += "\
                        <img class='skillIcon'\
                        onmousemove='showSkillPopupInfo(\""+skillInfo.command[cmdIdx]+"\")' \
                        onmouseout='hideSkillPopupInfo()' \
                        src='data/images/"+skillInfo.command[cmdIdx]+"_Skill.png'>";
                        break;
                    case "o":
                        innerHTML_str += "\
                        <img class='skillIcon'\
                        onmousemove='showSkillPopupInfo(\""+skillInfo.command[cmdIdx]+"\")' \
                        onmouseout='hideSkillPopupInfo()' \
                        src='data/images/small_o_Skill.png'>";
                        break;
                    default:
                        innerHTML_str += "<span style='color:white'>"+skillInfo.command[cmdIdx]+"</span>";
                        break;
                }
            }
            innerHTML_str+="\
            </td>\
            <td>";
            switch(skillInfo.type){
                case "공격형":
                    innerHTML_str += "<span class='DPTEXT_08'>";
                    break;
                case "소환형":
                    innerHTML_str += "<span class='DPTEXT_03'>";
                    break;
                case "유틸기":
                    innerHTML_str += "<span class='DPTEXT_0E'>";
                    break;
                case "회복형":
                    innerHTML_str += "<span class='DPTEXT_07'>";
                    break;
                default:
                    console.log("unknown skill type:"+skillInfo.type);
                    break;
            }
            innerHTML_str+= skillInfo.type+"</span></td>\
        </tr>\
        <tr>\
            <td>\
                <span class='skillCommand DPTEXT_07'>"+skillInfo.command+" Skill - </span>\
                <span class='skillName DPTEXT_0F'>"+skillInfo.name+"</span>\
            </td>\
        </tr>\
        <tr>\
            <td>\
                <span class='explanation DPTEXT_04'>"+skillInfo.explanation+"</span>\
            </td>\
        </tr>\
        </table>\
        ";
    }
    return innerHTML_str;
}
function getAvailableBuildingViewer(buildings){
    var innerHTML_str="";
    for (var i =0; i < buildings.length; ++i){
        var buildingInfo = buildings[i];
        innerHTML_str += "\
        <table class='skillContent'>\
        <tr>\
            <td>";
            var bRemoveFirstLetter = [];
            for(var cmdIdx = 0; cmdIdx < buildingInfo.command.length; ++cmdIdx)
            {
                switch(buildingInfo.command[cmdIdx]){
                    case "Z":
                    case "T":
                    case "P":
                        var buildingName = buildingInfo.command.substring(cmdIdx,cmdIdx+3);

                        innerHTML_str += "\
                        <img class='skillIcon'\
                        onmousemove='showSkillPopupInfo(\""+buildingName+"\",true)' \
                        onmouseout='hideSkillPopupInfo()' \
                        src='data/images/"+buildingName+"_building.png'>";
                        bRemoveFirstLetter.push(cmdIdx);
                        cmdIdx+=2;
                        break;
                    case "v":
                        innerHTML_str += "\
                        <img class='skillIcon'\
                        onmousemove='showSkillPopupInfo(\""+buildingInfo.command[cmdIdx]+"\",true)' \
                        onmouseout='hideSkillPopupInfo()' \
                        src='data/images/small_v_Skill.png'>";
                        break;
                    case "s":
                        innerHTML_str += "\
                        <img class='skillIcon'\
                        onmousemove='showSkillPopupInfo(\""+buildingInfo.command[cmdIdx]+"\",true)' \
                        onmouseout='hideSkillPopupInfo()' \
                        src='data/images/small_s_Skill.png'>";
                        break;
                    default:
                        innerHTML_str += "<span style='color:white'>"+buildingInfo.command[cmdIdx]+"</span>";
                        break;
                }
            }
            var outterCommand = "";
            var prevIdx = 0;
            console.log(bRemoveFirstLetter);
            for(var j = 0; j < bRemoveFirstLetter.length; ++j){
                if(bRemoveFirstLetter[j] > 0){
                    let t1 = buildingInfo.command.substring(prevIdx,bRemoveFirstLetter[j]);
                    outterCommand += t1;
                }
                prevIdx = bRemoveFirstLetter[j]+1;
            }
            outterCommand += buildingInfo.command.substring(prevIdx);
            innerHTML_str+="</td>";
            if(buildingInfo.type != null){
                innerHTML_str+="\
                <td>";
                switch(buildingInfo.type){
                    case "공격형":
                        innerHTML_str += "<span class='DPTEXT_08'>";
                        break;
                    case "소환형":
                        innerHTML_str += "<span class='DPTEXT_03'>";
                        break;
                    case "유틸기":
                        innerHTML_str += "<span class='DPTEXT_0E'>";
                        break;
                    case "회복형":
                        innerHTML_str += "<span class='DPTEXT_07'>";
                        break;
                    default:
                        console.log("unknown skill type:"+buildingInfo.type);
                        break;
                }
                innerHTML_str+= buildingInfo.type+"</span>\
                </td>";
            }
            innerHTML_str+="\
        </tr>\
        <tr>\
            <td>\
                <span class='skillCommand DPTEXT_07'>"+outterCommand+" - </span>\
                <span class='skillName DPTEXT_0F'>"+buildingInfo.name+"</span>\
            </td>\
        </tr>";
        if(buildingInfo.explanation != null){
            innerHTML_str +="\
            <tr>\
                <td>\
                    <span class='explanation DPTEXT_04'>"+buildingInfo.explanation+"</span>\
                </td>\
            </tr>";
        }
        if(buildingInfo.usage != null){
            innerHTML_str += "<tr>\
            <td>\
            <span class='skillUsage DPTEXT_04'>"+buildingInfo.usage+"</span>\
            </td>\
            </tr>\
            </table>";
        }
    }
    return innerHTML_str;
}
function get_query(){
    var url = document.location.href;
    var qs = url.substring(url.indexOf('?') + 1).split('&');
    for(var i = 0, result = {}; i < qs.length; i++){
        qs[i] = qs[i].split('=');
        result[qs[i][0]] = decodeURIComponent(qs[i][1]);
    }
    return result;
}

function onClickMissionObjBtn(missionObjBtn)
{
    missionObjBtn.style.display='none';
    var missionObjViewer = document.getElementById("missionObjViewer");
    missionObjViewer.style.display="block";
}
function onClickMissionObjPrevBtn()
{
    var missionObjBtn = document.getElementById("missionObjBtn");
    missionObjBtn.style.display='block';
    var missionObjViewer = document.getElementById("missionObjViewer");
    missionObjViewer.style.display="none";
}

function getUnitSpecInnerHTML(classIdx)
{
    var unitSpec = classData.classes[classIdx].unitSpec;
    var innerHTML_str = "\
    <div class='unitSpec'>\
        <span>체력: "+unitSpec.hp+"</span>\
        <span>기본방어력: "+unitSpec.armor+"</span>";
        if(unitSpec.shield > 0)
            innerHTML_str += "<span>쉴드: "+unitSpec.shield+"</span>";
        innerHTML_str+="\
        <span>공격력: "+unitSpec.damage+"</span>\
        <span>업당 공격력: "+unitSpec.damage_factor+"</span>\
    </div>";
    return innerHTML_str;
}
