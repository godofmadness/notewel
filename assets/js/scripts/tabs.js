/**
 * Created by mm on 4/7/17.
 */


angular.module('notewel').service('notewelTabs', function(){


  function __hasCurrentClass(element , classToCompareTo) {
    // console.log(element);
    return element.className.split(' ').find(function(className) {
      return className === classToCompareTo;
    });
  }

  this.initializeTabs = function() {

    var $tabs = $(".notewel-tabs").children(".tab");
    var activeTab = null;

    // find current active
    // first initialization
    $tabs.each(function() {
      // if with class notewel-active make this tab active
      if ($(this).hasClass('notewel-active')) {
        activeTab = $(this)[0];
      } else {
        $("#"+$(this)[0].getAttribute('data-tab')).css('display', 'none');
      }
    });


    console.log("CURRENT ACTIVE TAB: " + activeTab);




    $('.tab').on('click', function () {

      // if clicked element not active element
      if (!__hasCurrentClass(this, 'notewel-active') && activeTab != null) {

        var classArr = activeTab.className.split(' ');

        //delete notewel-active class from current active tab

        if (classArr.indexOf('notewel-active') > 0) {
          classArr.splice(classArr.indexOf('notewel-active'), 1);
          activeTab.className = classArr;

          // set display property of block that references by this tab selection to none
          $("#" + activeTab.getAttribute('data-tab')).css('display', 'none');
        }


        // add notewel-active to cliked tab
        this.className += ' notewel-active';

        // set display property of clicked tab to block
        $("#" + this.getAttribute('data-tab')).css('display', 'block');
        activeTab = this;

      } else {
        console.log('dont have class');
        return;
      }

    });

  }

});
