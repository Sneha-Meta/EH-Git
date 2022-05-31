"use strict"
var context = null;
var clientUrl = null;
var UserID = null;
var userName = null;
var formContext = null;
var serverUrl = null;

function pxrmFunctions() {

    serverUrl = getServerUrl();
    context = getContext();
    clientUrl = getUrlandVersion();
    if (context !== null && context !== undefined && context !== "") {
        userName = context.getUserName();
        UserID = context.getUserId();
        UserID = UserID.slice(1, -1);
    }
}
function OpenExportToExcel(data) {
    var url = clientUrl;
    window.open(url + "//WebResources/eh_ExportRequestForm?data=" + data, "ExporttoExcel", "height=400,width=800,top=100,left=100");
}
// JavaScript source code

function PosttoOracle(formContext) {
    if (formContext !== null) {
        pxrmFunctions();


        var Saleid = formContext.data.entity.getId();
        var type = "";
        var Trigger = "";
        var md_integrationsuccessflag = "";
        var md_integrationsuccessflag_formatted = "";
        var SaleType = formContext.getAttribute("md_saletype").getValue();
        Saleid = Saleid.slice(1, -1);
        if (clientUrl !== null) {

debugger;

            var req = new XMLHttpRequest();
            req.open("GET", clientUrl + "md_unitsales(" + Saleid + ")?$select=md_errordescription,md_integrationsuccessflag,md_integrationtriggervalue,md_oraclecustaccountid,md_oraclenumber", false);
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            req.onreadystatechange = function() {
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    if (this.status === 200) {
                        var result = JSON.parse(this.response);
                        var md_errordescription = result["md_errordescription"];
                         md_integrationsuccessflag = result["md_integrationsuccessflag"];
                         md_integrationsuccessflag_formatted = result["md_integrationsuccessflag@OData.Community.Display.V1.FormattedValue"];
                        var md_integrationtriggervalue = result["md_integrationtriggervalue"];
                        var md_oraclecustaccountid = result["md_oraclecustaccountid"];
                        var md_oraclenumber = result["md_oraclenumber"];
                        if ((md_integrationtriggervalue==null)&&(md_integrationsuccessflag_formatted !== "Succsess")) {

                            type = formContext.getAttribute("md_customertype").getValue();
                            if (type !== null) {
                                if (SaleType === 899230005)//downgrade
                                {
                                    if (type === 100000003)//Individual
                                    {
                                        Trigger = "TrueIndividualDowngrade";

                                    }
                                    else if (type === 100000000)//Corporate
                                    {
                                        Trigger = "TrueCorporateDowngrade";
                                    }
                                }
                                else if (SaleType === 899230009)//new
                                {
                                    if (type === 100000003)//Individual
                                    {
                                        Trigger = "TrueIndividual";

                                    }
                                    else if (type === 100000000)//Corporate
                                    {
                                        Trigger = "TrueCorporate";
                                    }
                                }
                                else if (SaleType === 899230000)//upgrde
                                {
                                    if (type === 100000003)//Individual
                                    {
                                        Trigger = "TrueIndividualUpgrade";

                                    }
                                    else if (type === 100000000)//Corporate
                                    {
                                        Trigger = "TrueCorporateUpgrade";
                                    }
                                }
                                else if (SaleType === 899230003)//transfer
                                {
                                    if (type === 100000003)//Individual
                                    {
                                        Trigger = "TrueIndividualPMT";

                                    }
                                    else if (type === 100000000)//Corporate
                                    {
                                        Trigger = "TrueCorporatePMT";
                                    }
                                }
                                UpdateSale(Saleid, Trigger);
                            }
                        }
                        else {
                            //alert("UnitSale Integration is already initiated.");
                        }
                    } else {
                        var error = JSON.parse(this.response).error;

                 Xrm.Navigation.openAlertDialog("Error  " + error.message);
                    }
                }
            };
            req.send();
        }
    }

}

function UpdateSale(Saleid, Trigger) {

    var entity = {};
    entity.md_integrationtriggervalue = Trigger;
    entity.md_posttooracleclicked = false;

    var req = new XMLHttpRequest();
    req.open("PATCH", clientUrl + "md_unitsales(" + Saleid + ")", false);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            //req.onreadystatechange = null;
            if (this.status === 204) {
                //Success - No Return Data - Do Something
               openWindow(Saleid);
            } else {
                var error = JSON.parse(this.response).error;

                Xrm.Navigation.openAlertDialog("Error  " + error.message)
            }
        }
    };
    req.send(JSON.stringify(entity));
}

function openWindow(Saleid) {

    
    var recordUrl = "https://serbiamsddev.eaglehills.com/main.aspx?";
    var params = "etn=md_unitsale";
    params += "&pagetype=entityrecord";
    params += "&id=" + Saleid;
    params += "&histKey=512494977";
    params += "&newWindow=true";
    var mainURL = recordUrl + params;
    window.parent.location.href = mainURL;
}
// Added by James to launch post to oracle void dialog while clicking Post to oracle-void button in Invoice entity
function LaunchDialogPostToOracle(formContext, dialogId, typeName, recordId, refreshControl) {
    if (formContext !== null) {
        pxrmFunctions();

        var unitsale = null;
        var unitsaleid = null;
        var cminvoiceid = null;
        var statuscode = null;
        unitsale = formContext.getAttribute("md_unitsaleid").getValue();
        if (unitsale !== null) {
            unitsaleid = unitsale[0].id
            unitsaleid = unitsaleid.slice(1, -1);
        }
        //alert(unitsaleid);
        if (clientUrl !== null) {
            var req = new XMLHttpRequest();
            req.open("GET", clientUrl + "md_unitsales(" + unitsaleid + ")?$select=md_cminvoiceid,statuscode", false);
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            req.onreadystatechange = function () {
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    if (this.status === 200) {
                        var result = JSON.parse(this.response);
                        cminvoiceid = result["md_cminvoiceid"];
                        statuscode = result["statuscode"];
                    } else {
                        var error = JSON.parse(this.response).error;

                        Xrm.Navigation.openAlertDialog("Error in fetching unitsales  " + error.message);
                    }
                }
            };
            req.send();
        }
        // alert(statuscode);
        //condition to check whether the cminvoice id is null and status of the unitsale is sold or reserved
        if ((cminvoiceid === null) && ((statuscode === 899230000) || (statuscode === 899230016))) {
            dialogId = dialogId.replace("{", "");
            dialogId = dialogId.replace("}", "");

            tName = typeName;

            refreshControl = true;

            recordId = recordId.toString();
            recordId = recordId.replace("{", "");
            recordId = recordId.replace("}", "");


            var serverUri = Mscrm.CrmUri.create('/cs/dialog/rundialog.aspx');
            var mypath = serverUri + '?DialogID={' + dialogId.toUpperCase() + '}&EntityName=' + typeName + '&ObjectId={' + recordId + '}';
            mypath = encodeURI(mypath);


            popup = window.open(mypath, "Dialog", "height=480px,width=640px,status=0,toolbar=0,scrollbars=0, resizable=1");

            if (refreshControl !== null && refreshControl === true) {

                detailsWindowTimer = setInterval(WatchDetailsWindowForClose(), 600); //Poll

            }

        }
        else {

            alert("Please reinitiate the integration from post sale transaction as this is part of PST !!");
        }
    }
}

function WatchDetailsWindowForClose() {

    if (!popup || popup.closed) {

        /// Do your stuff here....

        clearInterval(detailsWindowTimer); //stop the timer

        if (formContext.data.entity.getIsDirty() === true) {

            formContext.data.entity.save();

        } else {
            var Id = formContext.data.entity.getId();

            var recordUrl = clientUrl + "/main.aspx?";
            var params = "etn=" + tName;
            params += "&pagetype=entityrecord";
            params += "&id=" + Id;
            params += "&histKey=512494977";
            params += "&newWindow=true";


            var mainURL = recordUrl + params;


            window.parent.parent.location.href = mainURL;
        }

    }

}
//Checklist
function OpenDocs(formContext) {
    if (formContext !== null) {

        var Id = formContext.data.entity.getId();
        var EntityName = formContext.data.entity.getEntityName();

        var customertype = "";
        var condition = "";
        var Category = "";
        if (EntityName === "md_offer") {

            //  alert(Id);
            customertype = formContext.getAttribute("md_customertype").getValue();
            Category = formContext.getAttribute("md_category").getValue();
            if (Category === 1) {
                Category = "Sales"
            }
            else {
                Category = "Lease"
            }
            //    alert(customertype);
            condition = "";
            if (customertype === 100000000) {
                condition = "md_customertype=Company Tenant";
            }
            else if (customertype === 100000001) {
                condition = "md_customertype=Clinical (Medical)";
            }
            else if (customertype === 100000002) {
                condition = "md_customertype=Individual (Medical)";
            }
            else if (customertype === 100000003) {
                condition = "md_customertype=Individual (Personal)";
            }



            var BusinessUnit = "EH";// Belongsto();

            if (BusinessUnit === null) {
                alert("Please set the Business Unit for the unit");
                return;
            }
            else
                condition += "BusinessUnit=" + BusinessUnit + "";

            if (Category !== null) {
                condition += " and Category eq " + Category + "";
            }
            else {
                alert("Please set the Offer category");
                return;
            }



            var DocObjCode = window.parent.Mscrm.EntityPropUtil.EntityTypeName2CodeMap["md_document"];

            var ObjentityName = "md_document";

            var customParameters = encodeURIComponent("Id=" + Id + "&ObjCode=" + DocObjCode + "&condition=" + condition + "&Entityname=" + EntityName + "&ObjentityName=" + ObjentityName);

           // Xrm.Utility.openWebResource("md_/DocumentChecklist.htm", customParameters, 800, 600);
            var windowOptions = { openInNewWindow: true, height: 800, width: 600 }

            Xrm.Navigation.openWebResource("md_/Documentlist.htm", windowOptions ,customParameters);


        }
        if ((EntityName === "account") || (EntityName === "contact") || (EntityName === "md_postsalestransactionheader") || (EntityName === "md_unitsale") || (EntityName === "md_unithandover") || (EntityName === "md_lpfwaiverbatch") || (EntityName === "md_inventoryimport") || (EntityName === "md_propertyattributesupdate") || (EntityName === "md_dataupdateapproval")) {
            var DocObjCode = "1";

            if (EntityName === "md_postsalestransactionheader") {

                var PSTType = formContext.attributes.get("md_type").getText();

                condition = "PSTTYPE:" + PSTType;

            }
            var ObjentityName = "md_document";
            //   alert(DocObjCode + "+" + ObjentityName + "+" + EntityName);
            var customParameters = encodeURIComponent("Id=" + Id + "&ObjCode=" + DocObjCode + "&condition=" + condition + "&Entityname=" + EntityName + "&ObjentityName =" + ObjentityName);
            var windowOptions = { openInNewWindow: true, height: 800, width: 600 }

            Xrm.Navigation.openWebResource("md_/Documentlist.htm", windowOptions ,customParameters);


            //Xrm.Utility.openWebResource("md_/DocumentChecklist.htm", customParameters, 800, 600);



        }


    }
}
function GetObjectTypeCode(entityName) {


    var lookupService = new RemoteCommand("LookupService", "RetrieveTypeCode");
    lookupService.SetParameter("entityName", entityName);
    var result = lookupService.Execute();

    if (result.Success && typeof result.ReturnValue === "number") {

        return result.ReturnValue;
    }
    else {

        return null;
    }
}


function refreshOfferForm(formContext) {
    if (formContext !== null) {
        var OfferId = formContext.data.entity.getId();


        var recordUrl = clientUrl + "/main.aspx?";

        var params = "etn=md_offer";
        params += "&pagetype=entityrecord";
        params += "&id=" + OfferId;
        params += "&histKey=512494977";
        params += "&newWindow=true";
        var mainURL = recordUrl + params;



        window.parent.location.href = mainURL;
    }




}

function Belongsto(formContext) {

    if (formContext !== null) {
        pxrmFunctions();
        var UnitLookup = formContext.getAttribute("md_unit");
        var Belongsto = "";
        if (UnitLookup.getValue() !== null) {

            var unitid = UnitLookup.getValue()[0].id;
            unitid = unitid.slice(1, -1);
            if (clientUrl !== null) {
                var req = new XMLHttpRequest();
                req.open("GET", clientUrl + "md_units(" + unitid + ")?$select=_md_belongstoid_value", false);
                req.setRequestHeader("OData-MaxVersion", "4.0");
                req.setRequestHeader("OData-Version", "4.0");
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
                req.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        req.onreadystatechange = null;
                        if (this.status === 200) {
                            var result = JSON.parse(this.response);
                            if (result["_md_belongstoid_value"] !== null && result["_md_belongstoid_value"] !== undefined && result["_md_belongstoid_value"] !== "") {
                                var _md_belongstoid_value = result["_md_belongstoid_value"];
                                Belongsto = result["_md_belongstoid_value@OData.Community.Display.V1.FormattedValue"];
                                var _md_belongstoid_value_lookuplogicalname = result["_md_belongstoid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                            }
                        } else {
                            var error = JSON.parse(this.response).error;

                            Xrm.Navigation.openAlertDialog("Error " + error.message);
                        }
                    }
                };
                req.send();
            }


        }
        return Belongsto;
    }
}
// JavaScript source code
// amount Validation

function LaunchModalDialog(formContext) {
    if (formContext !== null) {
        var UnitSaleId = formContext.data.entity.getId();
        UnitSaleId = UnitSaleId.slice(1, -1);
        if(UnitSaleId != null){
            var entity = {};
            entity.md_createfinalinvoice = true;   //absent
            var req = new XMLHttpRequest();
             req.open("PATCH", clientUrl + "md_unitsales(" + regId + ")", false);
             req.setRequestHeader("OData-MaxVersion", "4.0");
             req.setRequestHeader("OData-Version", "4.0");
             req.setRequestHeader("Accept", "application/json");
             req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
             req.onreadystatechange = function () {
                 if (this.readyState === 4) {
                     req.onreadystatechange = null;
                     if (this.status === 204) {
                         //Success - No Return Data - Do Something
                         refreshGlobal(formContext);
                     } else {
                         Xrm.Navigation.openAlertDialog(JSON.parse(this.response).error.message);
                     }
                 }
             };
             req.send(JSON.stringify(entity));
            }
    }
} 
function AmountValidation(formContext) {
    if (formContext !== null) {
        pxrmFunctions();
        var count = 0;
        UnitSaleId = formContext.data.entity.getId();
        var UnitSaleId = UnitSaleId.slice(1, -1);

        if (clientUrl !== null) {
            var req = new XMLHttpRequest();
            req.open("GET", clientUrl + "md_paymentplanitems?$select=md_pendingamount&$filter=(statuscode eq 899230000 or  statuscode eq 1) and md_pendingamount gt 0 and  _md_sale_value eq " + UnitSaleId + "", false);
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.onreadystatechange = function () {
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    if (this.status === 200) {
                        var results = JSON.parse(this.response);
                        var Amount = 0;
                        var md_pendingamount = 0;
                        for (var i = 0; i < results.value.length; i++) {
                            var md_pendingamount = results.value[i]["md_pendingamount"];

                            Amount = Amount + md_pendingamount;
                        }

                        //Checking whether the pending Amount for PPI greater than 20 Euro
                        if (Amount > 20) {
                            alert("Canâ€™t proceed with Pending Amount more than 20 Euro!");
                            count = 1;
                        }

                        else {
                            var req1 = new XMLHttpRequest();
                            req1.open("GET", clientUrl + "md_unitsales(" + UnitSaleId + ")?$select=md_revenue,md_totaldealvalue", false);
                            req1.setRequestHeader("OData-MaxVersion", "4.0");
                            req1.setRequestHeader("OData-Version", "4.0");
                            req1.setRequestHeader("Accept", "application/json");
                            req1.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                            req1.onreadystatechange = function () {
                                if (this.readyState === 4) {
                                    req1.onreadystatechange = null;
                                    if (this.status === 200) {
                                        var result = JSON.parse(this.response);
                                        var md_revenue = result["md_revenue"];
                                        var md_totaldealvalue = result["md_totaldealvalue"];

                                        var difference = md_totaldealvalue - md_revenue;
                                        //Checking whether Collection and TotaldealValue difference is greater than 20
                                        if (difference > 20) {
                                            alert("More than 20 Euro of deal price is pending for collecting!!!");
                                            count = 1;
                                        }

                                        else {

                                            var req2 = new XMLHttpRequest();
                                            req2.open("GET", clientUrl + "md_invoices?$filter=_md_unitsaleid_value eq " + UnitSaleId + " and  statuscode eq 1 and  md_finalinvoicetype eq 100000001", false);
                                            req2.setRequestHeader("OData-MaxVersion", "4.0");
                                            req2.setRequestHeader("OData-Version", "4.0");
                                            req2.setRequestHeader("Accept", "application/json");
                                            req2.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                                            req2.onreadystatechange = function () {
                                                if (this.readyState === 4) {
                                                    req2.onreadystatechange = null;
                                                    if (this.status === 200) {
                                                        var results = JSON.parse(this.response);
                                                        if (results.value.length > 0) {
                                                            alert("Please cancel active Final Invoices to generate again");
                                                        }
                                                        else {
                                                            LaunchModalDialog(formContext);
                                                        }

                                                        var error = JSON.parse(this.response).error;

                                                        Xrm.Navigation.openAlertDialog("Error in fetching invoices " + error.message);
                                                    }
                                                }
                                            };
                                            req2.send();

                                        }
                                    } else {
                                        var error = JSON.parse(this.response).error;

                                        Xrm.Navigation.openAlertDialog("Error  " + error.message);
                                    }
                                }
                            };
                            req1.send();
                        }
                    } else {
                        var error = JSON.parse(this.response).error;

                        Xrm.Navigation.openAlertDialog("Error  " + error.message);
                    }
                }
            };
            req.send();
        }
    }

}var currReportName;

function openReports(selectedControlSelectedItemIds, firstPrimaryItemId, primaryEntityTypeName, reportContext) {

    var selectedGridIDs = "";
    var primaryItemID = "";
    var reportName = "";

    //alert(selectedControlSelectedItemIds + "--" + firstPrimaryItemId + "--" + primaryEntityTypeName + "--" + reportContext);



    if (primaryItemID !== null) {
        primaryItemID = firstPrimaryItemId.toString().replace("{", "").replace("}", "");

    }


    if (selectedControlSelectedItemIds !== null) {

        selectedUnitIDs = selectedControlSelectedItemIds.toString();
        var arrSelectedGridIDs = selectedGridIDs.split(",");
        var formattedGridIDs = "", arrformattedGridIDs = [];
        for (var indxIds = 0; indxIds < arrSelectedGridIDs.length; indxIds++) {
            arrformattedGridIDs[indxIds] = "p:unitids=\'%7b" + arrSelectedGridIDs[indxIds].replace("{", "").replace("}", "") + "%7d\'";
        }
        formattedGridIDs = arrformattedGridIDs.join("&");
        reportName = "Quotation";

    }

    if ((primaryEntityTypeName === "md_unitsale") && (reportContext === "Booking")) {
        reportName = "Booking Form";
    }
    if ((primaryEntityTypeName === "md_unitsale") && (reportContext === "PenaltySummary")) {
        reportName = "Penalty Summary";
    }
    if ((primaryEntityTypeName === "md_unitleasing") && (reportContext === "Rent-Request")) {
        reportName = "Rental Form";
    }

    if ((primaryEntityTypeName === "md_offer") && (reportContext === "Booking-Offer")) {

        reportName = "Booking-Offer";
    }

    if ((primaryEntityTypeName === "md_receipt") && (reportContext === "Receipt")) {

        reportName = "Receipt Form";
    }

    if ((primaryEntityTypeName === "md_invoice") && (reportContext === "Invoice-Form")) {

        reportName = "Invoice-Form";
    }

    if ((primaryEntityTypeName === "lead") && (reportContext === "Duplicated Lead Report")) {

        reportName = "Duplicated Lead Report";
    }
    //alert(primaryEntityTypeName);
    //alert(reportContext);

    if ((primaryEntityTypeName === "md_propertyattributesupdate") && (reportContext === "Preview on Property Attribute Update")) {
        //alert("here1");

        reportName = "Preview on Property Attribute Update";
        //alert(reportName);
    }


    openReport(reportName, primaryItemID, formattedGridIDs, primaryEntityTypeName, reportContext);
}

function openReport(reportName, primaryItemID, formattedGridIDs, primaryEntityTypeName, reportContext) {
    var oDataSetName = "ReportSet";
    var columns = "ReportId";
    var filter = "Name eq '" + reportName + "'";
    retrieveMultiple(oDataSetName, columns, filter, onSuccess, primaryItemID, formattedGridIDs, primaryEntityTypeName, reportContext);
    currReportName = reportName;
}

function onSuccess(data, textStatus, XmlHttpRequest, primaryItemID, formattedGridIDs, primaryEntityTypeName, reportContext) {
    var serverUrl = clientUrl;
    //var serverUrl= document.location.protocol + "//" + document.location.host + "/" + Xrm.Page.context.getOrgUniqueName() ;

    if (data && data.length > 0) {
        //var serverUrl = Xrm.Page.context.getClientUrl();

        var etc = context.getQueryStringParameters().etc;

        var reportId = data[0].ReportId.replace("{", "").replace("}", "");

        if ((primaryEntityTypeName === "opporunity") && (formattedGridIDs !== null)) {
            var url = serverUrl + "/crmreports/viewer/viewer.aspx?action=run&helpID=" + currReportName + ".rdl&id=%7b" + reportId + "%7d&" + selectedUnitIDs + "&p:opportunityid=%7b" + primaryItemID + "%7d&recordstype=" + etc;
        }

        if ((primaryEntityTypeName === "md_unitsale") && (reportContext === "Booking")) {
            var url = serverUrl + "/crmreports/viewer/viewer.aspx?action=run&helpID=" + currReportName + ".rdl&id=%7b" + reportId + "%7d&p:unitsaleid=%7b" + primaryItemID + "%7d&recordstype=" + etc;
        }
        if ((primaryEntityTypeName === "md_unitsale") && (reportContext === "PenaltySummary")) {
            var url = serverUrl + "/crmreports/viewer/viewer.aspx?action=run&helpID=" + currReportName + ".rdl&id=%7b" + reportId + "%7d&p:unitsaleid=%7b" + primaryItemID + "%7d&recordstype=" + etc;
        }
        if ((primaryEntityTypeName === "md_unitleasing") && (reportContext === "Rent-Request")) {
            var url = serverUrl + "/crmreports/viewer/viewer.aspx?action=run&helpID=" + currReportName + ".rdl&id=%7b" + reportId + "%7d&p:unitleasingid=%7b" + primaryItemID + "%7d&recordstype=" + etc;

        }

        if ((primaryEntityTypeName === "md_receipt") && (reportContext === "Receipt")) {

            var url = serverUrl + "/crmreports/viewer/viewer.aspx?action=run&helpID=" + currReportName + ".rdl&id=%7b" + reportId + "%7d&p:ReceiptID=%7b" + primaryItemID + "%7d&recordstype=" + etc;
            // alert(url);
        }

        if ((primaryEntityTypeName === "md_offer") && (reportContext === "Booking-Offer")) {

            var url = serverUrl + "/crmreports/viewer/viewer.aspx?action=run&helpID=" + currReportName + ".rdl&id=%7b" + reportId + "%7d&p:offerid=%7b" + primaryItemID + "%7d&recordstype=" + etc;

        }

        if ((primaryEntityTypeName === "md_invoice") && (reportContext === "Invoice-Form")) {

            var url = serverUrl + "/crmreports/viewer/viewer.aspx?action=run&helpID=" + currReportName + ".rdl&id=%7b" + reportId + "%7d&p:Invoice_ID=%7b" + primaryItemID + "%7d&recordstype=" + etc;

        }

        if ((primaryEntityTypeName === "lead") && (reportContext === "Duplicated Lead Report")) {

            var url = "https://propertyxrm.crm4.dynamics.com/crmreports/viewer/viewer.aspx?action=run&helpID=DuplicatedLead_Reportv1.rdl&id=%7bDCDBCA1D-6225-E511-8108-C4346BAD60C4%7d";

        }
        //alert(primaryEntityTypeName);
        //alert(reportContext);
        if ((primaryEntityTypeName === "md_propertyattributesupdate") && (reportContext === "Preview on Property Attribute Update")) {
            //alert("here");

            var url = serverUrl + "/crmreports/viewer/viewer.aspx?action=run&helpID=" + currReportName + ".rdl&id=%7b" + reportId + "%7d&p:PAUID=%7b" + primaryItemID + "%7d&recordstype=" + etc;
            //alert(url);

        }



        var w = 950;
        var h = 650;
        var left = (screen.width / 2) - (w / 2);
        var top = (screen.height / 2) - (h / 2);

        window.open(url, "reportwindow", "resizable=1,width=950,height=700,left=" + left + " ,top=" + top);
    }
}

function retrieveMultiple(odataSetName, select, filter, successCallback, primaryItemID, formattedGridIDs, primaryEntityTypeName, reportContext) {
    if (clientUrl !== null) {
        var req = new XMLHttpRequest();
        req.open("GET", clientUrl + "reports?$filter=name eq '" + currReportName + "'and  reportid eq '" + select + "", false);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    var results = JSON.parse(this.response);
                    for (var i = 0; i < results.value.length; i++) {
                        var reportid = results.value[i]["reportid"];
                    }
                } else {
                    var error = JSON.parse(this.response).error;

                            Xrm.Navigation.openAlertDialog("Error in fetching reports" + error.message);
                }
            }
        };
        req.send();
    }

}

function openleadduplicatedreport() {



    var url = "https://propertyxrm.crm4.dynamics.com/crmreports/viewer/viewer.aspx?action=run&helpID=DuplicatedLead_Reportv1.rdl&id=%7bDCDBCA1D-6225-E511-8108-C4346BAD60C4%7d";
    var w = 950;
    var h = 650;
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);

    window.open(url, "reportwindow", "resizable=1,width=950,height=700,left=" + left + " ,top=" + top);
    return;

}
