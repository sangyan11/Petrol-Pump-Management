var sessionUtils = require('../utils/sessionUtils');
var util=require('util');
var databaseUtils=require('./../utils/databaseUtils');

module.exports = {
    showiProductPage: function* (next) {
        var pid;
        try{ pid=this.currentUser[0].PID;}
        catch(e){pid=0;}
        var ptype=this.request.query.ptype;
        var pname=this.request.query.pname;
        console.log(pid,pname,ptype);
        var queryString;
        var query;
        if(pname && pname!='All'){
            queryString='SELECT * FROM PRODUCT WHERE PID="%s" AND NAME="%s"';
            query=util.format(queryString,pid,pname);
        }
        else if(ptype && ptype!='All'){
            queryString='SELECT * FROM PRODUCT WHERE PID="%s" AND TYPE=%s';
            query=util.format(queryString,pid,parseInt(ptype));
        }
        else{
            queryString='SELECT * FROM PRODUCT WHERE PID="%s"';
            query=util.format(queryString,pid);
        }

            var productDetails=yield databaseUtils.executeQuery(query);

            queryString='SELECT NAME FROM PRODUCT WHERE PID=%s';
            query=util.format(queryString,pid);
            var productname=yield databaseUtils.executeQuery(query);

            yield this.render('iproduct',{
                productDetails:productDetails,
                productname:productname,
                pname:pname,
                ptype:ptype,
        });
    },
    showiProduct2Page: function* (next) {
        var pid;
try{ pid=this.currentUser[0].PID;}
catch(e){pid=0;}


        var queryString;
        var query;
        var productDetails
        
        var ppid=this.request.body.ppid;
        var name=this.request.body.name;
        var type=this.request.body.type;
        var price=this.request.body.price;
        var qty=this.request.body.qty;

        var act=this.request.body.act;
        var ptype=this.request.body.type;
        var pname=this.request.body.name;

        queryString='SELECT * FROM PRODUCT WHERE PID="%s"';
        query=util.format(queryString,pid);
        productDetails=yield databaseUtils.executeQuery(query);
        
        if(ppid==undefined){
            if(act=="0"){
                    if(pname=='all') pname="%";
                    if(ptype=="all"){
                        queryString='SELECT * FROM PRODUCT WHERE PID=%s AND NAME LIKE "%s"';
                        query=util.format(queryString,pid,pname);
                    }
                    else{
                        queryString='SELECT * FROM PRODUCT WHERE PID=%s AND TYPE=%s AND NAME LIKE "%s"';
                        query=util.format(queryString,pid,ptype,pname);
                    }
                        productDetails=yield databaseUtils.executeQuery(query);
            }
            else if(act=="1"){
                    queryString='INSERT INTO PRODUCT (PID,NAME,TYPE,PRICE,QTY) \
                    VALUES(%s,"%s",%s,%s,%s)';
                    query=util.format(queryString,pid,pname,ptype,price,qty);
                    var res=yield databaseUtils.executeQuery(query);
                    queryString='SELECT * FROM PRODUCT WHERE PID="%s"';
                    query=util.format(queryString,pid);
                     productDetails=yield databaseUtils.executeQuery(query);
                    
            }

        }
        else{
            queryString='UPDATE PRODUCT SET NAME="%s",TYPE="%s",PRICE=%s,QTY=%s WHERE ID=%s';
            query=util.format(queryString,name,type,price,qty,ppid);
            var r=yield databaseUtils.executeQuery(query);
        }

            
            

            queryString='SELECT NAME FROM PRODUCT WHERE PID=%s';
            query=util.format(queryString,pid);
            var productname=yield databaseUtils.executeQuery(query);

            this.redirect('iproduct');
},
    showiTankPage: function* (next) {
        var pid;
try{ pid=this.currentUser[0].PID;}
catch(e){pid=0;}


        var QueryString;
        var query;
        var ttype=this.request.query.ttype;
        var ttype;
        if((!ttype) || ttype=='All'){
            QueryString='SELECT ID,CAPACITY,TYPE,ACTIVE FROM TANK_METADATA WHERE PID=%s';
            query=util.format(QueryString,pid);
        }
        else{
            QueryString='SELECT ID,CAPACITY,TYPE,ACTIVE FROM TANK_METADATA WHERE PID=%s AND TYPE="%s"';
            query=util.format(QueryString,pid,ttype);
        }
        
        var DetailtankResult=yield databaseUtils.executeQuery(query);

        var QueryString='SELECT DISTINCT(TYPE) FROM TANK_METADATA WHERE PID=%s';
        var query=util.format(QueryString,pid);
        var tankType=yield databaseUtils.executeQuery(query);
        yield this.render('itank',{
            DetailtankResult:DetailtankResult,
            tankType:tankType,
            ttype:ttype,
    });
},
showiTank2Page: function* (next) {
    var pid;
    var tid=this.request.body.tid;
    var cap=this.request.body.capacity;
    var type=this.request.body.type;
    if(tid==undefined||cap==undefined||type==undefined){}
    else{
    var queryString='UPDATE TANK_METADATA SET CAPACITY=%s,TYPE="%s" WHERE ID=%s';
    var query=util.format(queryString,cap,type,tid);
    var res=yield databaseUtils.executeQuery(query);
    }

    try{
    var pid=this.request.body.pid;
    var cap=this.request.body.capacity;
    var type=this.request.body.type;
    var queryString='INSERT INTO TANK_METADATA (PID,CAPACITY,TYPE) \
    VALUES(%s,%s,"%s")';
    var query=util.format(queryString,pid,cap,type);
    var res=yield databaseUtils.executeQuery(query);
    }
    catch(e){
        var pid;
try{ pid=this.currentUser[0].PID;}
catch(e){pid=0;}

    }
    var DetailtankQueryString;
    var DetailtankQuery;
    var wf;
    try{
        var wf=this.request.body.ttype;
        if (wf=='all'){
            DetailtankQueryString='SELECT ID,CAPACITY,TYPE,ACTIVE FROM TANK_METADATA WHERE PID=%s';
            DetailtankQuery=util.format(DetailtankQueryString,pid);
        }
        else{
            DetailtankQueryString='SELECT ID,CAPACITY,TYPE,ACTIVE FROM TANK_METADATA WHERE PID=%s and TYPE="%s"';
            DetailtankQuery=util.format(DetailtankQueryString,pid,wf);
        }
    }
    catch(ee){
    }
    if(wf==undefined){
    DetailtankQueryString='SELECT ID,CAPACITY,TYPE,ACTIVE FROM TANK_METADATA WHERE PID=%s';
    DetailtankQuery=util.format(DetailtankQueryString,pid);
    }
    
    var DetailtankResult=yield databaseUtils.executeQuery(DetailtankQuery);
    
    

    var tankTypeQueryString='SELECT DISTINCT(TYPE) FROM TANK_METADATA WHERE PID=%s';
    var tankTypeQuery=util.format(tankTypeQueryString,pid);
    var tankType=yield databaseUtils.executeQuery(tankTypeQuery);

    this.redirect('itank');
},
showiTank3Page: function* (next) {
    var pid;
    try{ pid=this.currentUser[0].PID;}
catch(e){pid=0;}

    var queryString;
    var query;
    var tid;
    var cap=this.request.body.capacity;
    var type=this.request.body.type;
    var act=this.request.body.tid.split(' ');

    if(parseInt(act[0])==1){
        var queryString='INSERT INTO TANK_METADATA (PID,CAPACITY,TYPE) \
        VALUES(%s,%s,"%s")';
        var query=util.format(queryString,pid,cap,type);
        var res=yield databaseUtils.executeQuery(query);
    }
    else{
        var tid=parseInt(act[1]);
        var queryString='UPDATE TANK_METADATA SET CAPACITY=%s,TYPE="%s" WHERE ID=%s';
    var query=util.format(queryString,cap,type,tid);
    var res=yield databaseUtils.executeQuery(query);
    }
    this.redirect('itank');
},
}
