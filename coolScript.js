require([                                                                                                                                                                          
    "splunkjs/mvc",                                                                                                                                                                
    'splunk.util',                                                                                                                                                                 
    'backbone',                                                                                                                                                                    
    'jquery',                                                                                                                                                                      
    'underscore',                                                                                                                                                                  
    "/static/app/search/Modal.js",                                                                                                                                                 
    "splunkjs/mvc/simplexml/ready!"                                                                                                                                                
], function(mvc,SplunkUtil,Backbone,$,_,Modal) {                                                                                                                                   
                                                                                                                                                                                   
    var myCoolArray = mvc.Components.getInstances();                                                                                                                               
                                                                                                                                                                                   
    var exampleInfoCollection = new Backbone.Collection();                                                                                                                         
    var exampleInfoLoaded = exampleInfoCollection.fetch({                                                                                                                          
        url: SplunkUtil.make_url('/static/app/search/indexToPermission.json'),                                                                                                     
        cache: true                                                                                                                                                                
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
        
        arrayOfIndexNames.forEach(indexName => {                                                                                                                                   
            var ughhh = exampleInfoCollection.where({index: indexName});                                                                                                           
            console.log(ughhh);                                                                                                                                                    
            var blerg = JSON.stringify(ughhh);                                                                                                                                     
            console.log(blerg);                                                                                                                                                    
            var asdf  = JSON.parse(blerg);                                                                                                                                         
            console.log(asdf[0].group);                                                                                                                                            
        });                                                                                                                                                                        
                                                                                                                                                                                   
                                                                                                                                                                                   
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
                var modalBody = $('<p>Data in Splunk is stored in indexes.  Access to each index is governed by membership in Active Directory groups.  Here is how to get access</p>'
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
                                                                                                                                                                                   
        }))                                                                                                                                                                        
    });                                                                                                                                                                            
});               
