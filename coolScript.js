require([                                                                                                                                                                          
    "splunkjs/mvc", 
    "splunkjs/mvc/utils",
    "splunkjs/mvc/searchmanager",                                                                                                                                                               
    'splunk.util',                                                                                                                                                                 
    'backbone',                                                                                                                                                                    
    'jquery',                                                                                                                                                                      
    'underscore',                                                                                                                                                                  
    "/static/app/search/Modal.js",                                                                                                                                                 
    "splunkjs/mvc/simplexml/ready!"                                                                                                                                                
], function(mvc,utils,SearchManager,SplunkUtil,Backbone,$,_,Modal) {                                                                                                                                   
                                                                                                                                                                                   
    var myCoolArray = mvc.Components.getInstances();                                                                                                                               
                                                                                                                                                                                   
    var exampleInfoCollection = new Backbone.Collection();                                                                                                                         
    var exampleInfoLoaded = exampleInfoCollection.fetch({                                                                                                                          
        url: SplunkUtil.make_url('/static/app/search/indexToPermission.json'),                                                                                                     
        cache: true                                                                                                                                                                
    });          
    
    var desiredSearchName = "exampleSearch1"
    if (typeof splunkjs.mvc.Components.getInstance(desiredSearchName) == "object") {
        // console.log(desiredSearchName, "already exists. This probably means you're copy-pasting the same code repeatedly, and so we will clear out the old object for convenience")
        splunkjs.mvc.Components.revokeInstance(desiredSearchName)
    }
    var sm = new SearchManager({
        "id": desiredSearchName,
        "cancelOnUnload": true,
        "latest_time": "",
        "status_buckets": 0,
        "earliest_time": "0",
        "search": "| inputlookup indexToADGroup.csv",
        "app": utils.getCurrentApp(),
        "preview": true,
        "runWhenTimeIsUndefined": false,
        "autostart": true
    }, { tokens: true, tokenNamespace: "submitted" });
    // To manually check the status at any time, open the Javascript Console and run splunkjs.mvc.Components.getInstance("exampleSearch1") -- particularly accessing attributes.data
    // You will also find fun methods like splunkjs.mvc.Components.getInstance("exampleSearch1").startSearch() and others.
    sm.on('search:start', function(properties) {
        var searchName = properties.content.request.label
            // console.log(searchName, "started", properties)
    });
    sm.on('search:error', function(properties) {
        // console.log("errored", properties)
        $("#results").html("<p><span style=\"color: red; font-weight: bolder;\">ERROR!</span> Error running search! Check out the error in the Javascript Console.</p>")
    });
    sm.on('search:fail', function(properties) {
        var searchName = properties.content.request.label
            // console.log(searchName, "failed", properties)
        $("#results").html("<p><span style=\"color: red; font-weight: bolder;\">ERROR!</span> Search Failed! Check out the error in the Javascript Console.</p>")
    });
    sm.on('search:done', function(properties) {
        var searchName = properties.content.request.label
        if (properties.content.resultCount == 0) {
            // console.log(searchName, "gave no results", properties)
            $("#results").html("<p><span style=\"color: red; font-weight: bolder;\">ERROR!</span> No Results.... do you have any data?</p>")
        } else {
            var results = splunkjs.mvc.Components.getInstance(searchName).data('results', { output_mode: 'json', count: 0 });
            results.on("data", function(properties) {
                var searchName = properties.attributes.manager.id
                var data = properties.data().results
                    // console.log(searchName, "gave results", properties, data)
                    // OPTION ONE 
                    // Let's push the results of the first event to a div with id="results"
                    // $("#results").text(data[0]['_raw'])
                    // OPTION TWO
                    // If we had multiple results (e.g., if you are doing | head 10 instead of head 1 in the search), let's iterate through and add each.
                //for (var i = 0; i < data.length; i++) {
                    //$("#results").append($("<pre></pre>").text(data[i]['_raw']))
                //}
                console.log("search result are...");
                console.log(data);
            })
        }
    }); 
                                                                                                                                                                                   
    $.when(exampleInfoLoaded).then(function(){                                                                                                                                     
        console.log(exampleInfoCollection);                                                                                                                                        
                                                                                                                                                                                   
        arrayOfSearchStrings = [];                                                                                                                                                 
                                                                                                                                                                                   
        myCoolArray.forEach(element => {                                                                                                                                           
            if (element.attributes) {                                                                                                                                              
                if (element.attributes.search) {                                                                                                                                   
                    arrayOfSearchStrings.push(element.attributes.search);                                                                                                          
                    //console.log(element.attributes.search);                                                                                                                      
                }                                                                                                                                                                  
            }                                                                                                                                                                      
        });                                                                                                                                                                        
                                                                                                                                                                                   
        //console.log(arrayOfSearchStrings);                                                                                                                                       
        var indexFinderRegex = /index\=([A-Za-z_\-\*]+)/g;                                                                                                                         
        var arrayOfIndexNames = [];                                                                                                                                                
                                                                                                                                                                                   
        arrayOfSearchStrings.forEach(element => {                                                                                                                                  
            //console.log(element);                                                                                                                                                
            var arrayOfOneSearchesRegexMatches;                                                                                                                                    
            while ((arrayOfOneSearchesRegexMatches = indexFinderRegex.exec(element)) !== null) {                                                                                   
                //console.log(arrayOfOneSearchesRegexMatches);                                                                                                                     
                arrayOfIndexNames.push(arrayOfOneSearchesRegexMatches[1]);                                                                                                         
            }                                                                                                                                                                      
        });                                                                                                                                                                        
        //console.log(arrayOfIndexNames);                                                                                                                                          
                                                                                                                                                                                   
        arrayOfIndexNames = _.uniq(arrayOfIndexNames);
        
        /*
        arrayOfIndexNames.forEach(indexName => {                                                                                                                                   
            var ughhh = exampleInfoCollection.where({index: indexName});                                                                                                           
            console.log(ughhh);                                                                                                                                                    
            var blerg = JSON.stringify(ughhh);                                                                                                                                     
            console.log(blerg);                                                                                                                                                    
            var asdf  = JSON.parse(blerg);                                                                                                                                         
            console.log(asdf[0].group);                                                                                                                                            
        });                */
        
        
                                                                                                                                                                                   
                            /*                                                                                                                                                       
        $("#modal1").append($("<button class=\"btn btn-primary\" >Click here for help</button>").click(function() {                                                                
                // Now we initialize the Modal itself                                                                                                                              
                var myModal = new Modal("modal1", {                                                                                                                                
                    title: "Permissions needed to view this dashboard",                                                                                                            
                    backdrop: 'static',                                                                                                                                            
                    keyboard: false,                                                                                                                                               
                    destroyOnHide: true,                                                                                                                                           
                    type: 'normal'                                                                                                                                                 
                });                                                                                                                                                                
                $(myModal.$el).on("hide", function() {                                                                                                                             
                    // Not taking any action on hide, but you can if you want to!                                                                                                  
                })                                                                                                                                                                 
                var modalBody = $('<p>Data in Splunk is stored in indexes.  Access to each index is governed by membership in Active Directory groups.  Here is how to get access t
                arrayOfIndexNames.forEach(element => {                                                                                                                             
                    var ughhh = exampleInfoCollection.where({index: element});                                                                                                     
                    console.log(ughhh);                                                                                                                                            
                    var blerg = JSON.stringify(ughhh);                                                                                                                             
                    console.log(blerg);                                                                                                                                            
                    var asdf  = JSON.parse(blerg);                                                                                                                                 
                    console.log(asdf[0].group);                                                                                                                                    
                    modalBody.find("tbody").append('<tr><td>' + element + '</td><td>' + asdf[0].group + '</td></tr>')                                                              
                });                                                                                                                                                                
                                                                                                                                                                                   
                myModal.body                                                                                                                                                       
                    .append(modalBody);                                                                                                                                            
                myModal.footer.append($('<button>').attr({                                                                                                                         
                    type: 'button',                                                                                                                                                
                    'data-dismiss': 'modal'                                                                                                                                        
                }).addClass('btn btn-primary').text('Close').on('click', function() {                                                                                              
                    // Not taking any action on Close... but I could!                                                                                                              
                }))                                                                                                                                                                
                myModal.show(); // Launch it!                                                                                                                                      
                                                                                                                                                                                   
        }))              */                                                                                                                                                          
    });                                                                                                                                                                            
});               