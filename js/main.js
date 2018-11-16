/*
cms 布局操作
2016-06-02
*/
$(function(){
  //发布 测试
  $('#sendBtn').on('click',function(){
    var getUrlObj = getAddressUrlParam();
    var htmlId = getUrlObj.id;
    var headerTpl = $('#cmsHeaderTemplate').val(),
        footerTpl = $('#cmsFooterTemplate').val();
    var htmlTpl = $('.send-tpl').html();  
    //console.log(headerTpl+htmlTpl+footerTpl);

    /*
    $.ajax({
      'type':'post',
      'data':{'content':htmlTpl,'id':htmlId},
      'url':'/',
      'success':function(resData){
        if(resData.success){
          console('ok.');
        }
      } 
    });
    */

    PagePostData.init();



    //页面设置背景上传插件
    $('#idid').fileinput({
      language: 'zh',
      uploadUrl: "/api/common/uploadFile",
      //showCaption: false,
      showPreview:false,
      autoReplace: true,
      maxFileCount: 1,
      uploadAsync:true,
      //initialPreview: ["<img style='height:80px' src='/'>"],
      //initialCaption: 'Initial-Image.jpg'
      allowedFileExtensions: ["jpg", "png", "gif"]
    }).on("fileuploaded", function(event, outData) {
      //文件上传成功后返回的数据， 此处我只保存返回文件的id
      var result = outData.response.data;
      // 对应的input 赋值
      //$('#spBgImg').val(result).change();
      //spBgImg.val(result);
      spBgImg.attr('url',result);
      //alert(spBgImg.val(result));
    });



  });
  
  //页面设置背景上传插件
  $("#spBgImg").fileinput({
      language: 'zh',
      uploadUrl: "/uploadfiles",
      //showCaption: false,
      showPreview:false,
      maxFileCount: 1,
      autoReplace: true,
      maxFileCount: 1,
      //initialPreview: ["<img style='height:80px' src='/'>"],
      //initialCaption: 'Initial-Image.jpg'
      allowedFileExtensions: ["jpg", "png", "gif"]
  });

  

  //颜色选择器
  $('input.color-input').excolor({
    root_path: 'js/excolor/img/'
  });
  //布局拖拽效果
  $(".layout-wrap").sortable({
    connectWith: ".layout-wrap",
    handle: ".f-layout",
    placeholder: "fl-placeholder ui-corner-all"
  });
  //对象初始化
  SetPageData.init();
  FareaSets.init();
  LayoutAdd.init();
  OpenPageSet.init();
  ModuleAdd.init();

});

//布局区域 hover set
var FareaSets = {
  init:function(){
    this.areaTpl = $('.send-tpl');
    this.fLayoutArea = $('.f-layout-area',this.areaTpl);
    this.fLayoutEl = $('.f-layout',this.fLayoutArea);
    //光标滑过布局块区域
    var that = this;
    this.areaTpl.on('mouseenter','.f-layout',function(){
      var meEl = $(this);
      that.hoverShow(meEl);
    }).on('mouseleave','.f-layout',function(){
      var meEl = $(this);
      that.hiddenOn(meEl);
    });
    this.setBtns();//布局内 按钮 click 处理
  },
  hoverShow:function(meEl){
    var meId = meEl.attr('typeid'),
        meName = meEl.attr('typetext');
    var meTitle = meName;    
    meEl.addClass('fl-on');//添加红框虚线
    var cmsFsetTpl = $('#cmsFsetTemplate').tmpl({'title':meTitle});
    meEl.append(cmsFsetTpl);//添加布局操作层
    var cmsAddModuleTpl = $('#cmsAddModuleTemplate').html();
    meEl.find('.fl-module').append(cmsAddModuleTpl);//添加模块操作层
  },
  hiddenOn:function(meEl){
    meEl.removeClass('fl-on');
    $('.f-set').remove();
    meEl.find('.fl-module .add-module-el').remove();
  },
  setBtns:function(){
    var that = this;
    //删除
    that.areaTpl.on('click','.fs-del-el',function(){
      var meEl = $(this);
      meEl.parents('.f-layout-area').remove();
    });
    //上移
    that.areaTpl.on('click','.fs-up-el',function(){
      var meEl = $(this),
          layoutArea = meEl.parents('.f-layout-area'),
          prevEl = layoutArea.prev();
      if(prevEl.length > 0) {
        prevEl.insertAfter(layoutArea);
      } 
    });
    //下移
    that.areaTpl.on('click','.fs-down-el',function(){
      var meEl = $(this),
          layoutArea = meEl.parents('.f-layout-area'),
          prevEl = layoutArea.next();
      if(prevEl.length > 0) {
        prevEl.insertBefore(layoutArea);
      } 
    });
    //设置
    var slIndex;
    that.areaTpl.on('click','.fs-set-el',function(){
      var meEl = $(this),
          layoutArea = meEl.parents('.f-layout-area'),
          layoutTpl = meEl.parents('.f-layout'),
          layoutBgColor = layoutArea.css('background-color'),
          layoutBgImage = layoutArea.css('background-image'),
          layoutInBgColor = layoutTpl.css('background-color');
      slIndex = layoutArea.index();  
      var modalWrap = $('#modalSetLayoutBg'),
          slInBgColor = $('#slInBgColor',modalWrap),
          slBgColor = $('#slBgColor',modalWrap),
          slBgImg = $('#slBgImg',modalWrap);     
      if(layoutBgColor == 'transparent'){
        layoutBgColor = '';
      }else{
        layoutBgColor = _rgbToHex(layoutBgColor);//rgb转成16进制
      }  
      if(layoutInBgColor == 'transparent'){
        layoutInBgColor = '';
      }else{
        layoutInBgColor = _rgbToHex(layoutInBgColor);//rgb转成16进制
      }  
      //初始化dialog input 值    
      slBgColor.val(layoutBgColor).next('input').css('background-color',layoutBgColor);  
      if(slBgColor.val() == 'transparent'){
        slBgColor.val('');
      }   
      slInBgColor.val(layoutInBgColor).next('input').css('background-color',layoutInBgColor);  
      if(slInBgColor.val() == 'transparent'){
        slInBgColor.val('');
      }   
      //console.log(layoutBgImage);
      //slBgImg.val(layoutBgImage.slice(5,-2));
      
      modalWrap.modal('show');
      //布局设置背景上传插件
      if (slBgImg.data('fileinput')) {
        slBgImg.fileinput('destroy');//创建前先销毁
      }
      //初始化上传插件
      slBgImg.fileinput({
          language: 'zh',
          uploadUrl: "/uploadfiles",
          //showCaption: false,
          showPreview:false,
          maxFileCount: 1,
          autoReplace: true,
          maxFileCount: 1,
          //initialPreview: ["<img style='height:80px' src='/'>"],
          //initialCaption: 'Initial-Image.jpg'
          allowedFileExtensions: ["jpg", "png", "gif"]
      });

    });
    //设置dialog 点击保存
    $('.set-layout-el').on('click',function(){
      var modalWrap = $('#modalSetLayoutBg'),
          slBgColor = $.trim($('#slBgColor',modalWrap).val()),
          slInBgColor = $.trim($('#slInBgColor',modalWrap).val()),
          slBgImg = $.trim($('#splgImg',modalWrap).val());
      var pageTpl = $('.f-layout-area').eq(slIndex);
      pageTpl.css({
        'background-color':slBgColor,
        'background-image':'url('+ slBgImg +')',
        'background-repeat':'no-repeat',
        'background-position':'center'
      }); 
      pageTpl.find('.f-layout').css({
        'background-color':slInBgColor,
      }); 
      modalWrap.modal('hide');
    });
  }
};

//添加布局
var LayoutAdd = {
  init:function(){
    this.addWrap = $('#modalAddLayout');
    this.addList = $('.add-layout-list',this.addWrap);
    //布局选中状态交互
    this.addList.find('li').on('click',function(evt){
      var meEl = $(this);
      meEl.parent().find('li').removeClass('on');
      meEl.addClass('on');
      evt.preventDefault();
    });
    //click 添加布局
    this.addLayout();
  },
  addLayout:function(){
    var that = this,
        addBtn = $('.add-layout-el',that.addWrap);
    var tpl = $('.send-tpl'),
        layoutWrap = $('.layout-wrap',tpl);    
    addBtn.on('click', function () {
      var layoutEl = $('.f-layout',layoutWrap),
          moduleEl = $('.fl-module',layoutWrap);
      var layoutTypeIds = [0],
          moduleIds = [0];   
      if(layoutEl){
        for(var i=0;i<layoutEl.length;i++){
          layoutTypeIds.push(layoutEl.eq(i).attr('typeid'));
        }  
        for(var i=0;i<moduleEl.length;i++){
          moduleIds.push(moduleEl.eq(i).attr('moduleid'));
        }  
      }
      var layoutId = parseInt(layoutTypeIds._max()) + 1,
          moduleId = parseInt(moduleIds._max()) + 1;
      var loVal = that.addList.find('li').filter('.on').attr('typename'),
          loText = that.addList.find('li').filter('.on').text(),
          htmlStr = '';
      var moduleId2 = '',
          moduleId3 = '';
      if(loVal == 'twocolumn'){
        moduleId2 = moduleId + 1;
      }else if(loVal == 'threecolumn'){
        moduleId2 = moduleId + 1;
        moduleId3 = moduleId + 2;
      }
      //添加布局模版渲染    
      var addLayoutFun = new AddLayoutFun({
        "layoutId":layoutId,//必填
        "layoutName":loVal,//必填
        "moduleId":moduleId,//必填
        "moduleId2":moduleId2,//必填
        "moduleId3":moduleId3//必填
      });
      addLayoutFun.init();
      //隐藏弹层
      that.hideDialog();
    });
  },
  hideDialog:function(){
    var that = this;
    that.addWrap.modal('hide');
  }
}
//页面设置
var OpenPageSet = {
  init:function(){
    this.modalWrap = $('#modalOpenSetPage');
    this.setBtn = $('.set-page-el',this.modalWrap);
    this.pageTpl = $('.layout-wrap');
    
    var that = this;
    //页面设置弹层初始化数据
    this.modalWrap.on('show.bs.modal', function () {
      that.renderFroms(this.modalWrap);
    });
    //点击dialog保存
    this.setBtn.on('click',function(){
      that.getFroms();
    });
  },
  renderFroms:function(dialogWrap){
    var that = this;
    var spBgColor = $('#spBgColor',dialogWrap),
        spBgImg = $('#spBgImg',dialogWrap);
    var pageBgColor = that.pageTpl.css('background-color'),
        pageBgImage = that.pageTpl.css('background-image');  
    if(pageBgColor == 'transparent'){
        pageBgColor = '';
    }else{
      pageBgColor = _rgbToHex(pageBgColor);//rgb转成16进制
    }        
    spBgColor.val(pageBgColor).next('input').css('background-color',pageBgColor);  
    if(spBgColor.val() == 'transparent'){
      spBgColor.val('');
    }   
    //spBgImg.val(pageBgImage.slice(5,-2));
  },
  getFroms:function(){
    var that = this;
    var spBgColor = $.trim($('#spBgColor').val()),
        spBgImg = $.trim($('#spBgImg').val());
    that.pageTpl.css({
      'background-color':spBgColor,
      'background-image':'url('+ spBgImg +')',
      'background-repeat':'no-repeat',
      'background-position':'center'
    }); 
    that.hideDialog();  
  },
  hideDialog:function(){
    var that = this;
    that.modalWrap.modal('hide');
  }
}

//添加模块
var ModuleAdd = {
  init:function(){
    this.areaTpl = $('.send-tpl');
    this.addWrap = $('#modalAddModule');
    this.addBtn = $('.add-module-el');
    this.swiperTpl = $('.f-module-swiper');
    var mIndex = 0;
    var that = this;
    //点击添加模块
    this.areaTpl.on('click','.add-module-el',function(){
      var meEl = $(this);
      mIndex = meEl.parent('.fl-module').attr('moduleid');
      that.addWrap.modal('show');
    });
    //点击置入
    this.addWrap.on('click','.md-addm-add',function(){
      var meEl = $(this),
          moduleName = meEl.attr('modulename');
      // if(modulename == 'swiper'){
      //   that.addSwiperModule(mIndex);
      // }else if(modulename == 'image'){
      //   that.addImageModule(mIndex);
      // }else if(modulename == 'text'){
      //   that.addTextModule(mIndex);
      // }
      var addModuleFun = new AddModuleFun({
        "moduleId":mIndex,
        "childrenId":that.setModulePid('.f-module-pannel'),
        "childrenType":moduleName
      });
      addModuleFun.init();
      that.addWrap.modal('hide');
    });
    //模块mouse
    this.areaTpl.on('mouseenter','.f-module-pannel',function(evt){
      var meEl = $(this);
      that.hoverShow(meEl);
      //evt.stopPropagation();
    }).on('mouseleave','.f-module-pannel',function(evt){
      var meEl = $(this);
      that.hiddenOn(meEl);
      //evt.stopPropagation();
    });
    //编辑设置模块
    var modalAddSwiper = $('#modalAddSwiper'),
        modalAddImage = $('#modalAddImage'),
        modalAddText = $('#modalAddText'),
        modalAddRegular = $('#modalAddRegular');
    var modulePannelId = 0;
    this.areaTpl.on('click','.fm-set-el',function(){
      var meEl = $(this),
          fModuleId = meEl.parents('.f-module-pannel').attr('typeid'),
          fModuleName = meEl.parents('.f-module-pannel').attr('modulename');
      mIndex = meEl.parents('.fl-module').attr('moduleid');  
      modulePannelId = fModuleId;
      if(fModuleName == 'image'){
        modalAddImage.modal('show');
        SetImageData.initImageDialog(mIndex,modulePannelId,modalAddImage);
      }else if(fModuleName == 'text'){
        modalAddText.modal('show');
        SetTextData.initTextDialog(mIndex,modulePannelId,modalAddText);
      }else if(fModuleName == 'regular'){
        modalAddRegular.modal('show');
        SetTextData.initRegualDialog(mIndex,modulePannelId,modalAddText);
      }
    });
    //删除模块
    this.areaTpl.on('click','.fm-del-el',function(){
      var meEl = $(this);
      meEl.parents('.f-module-pannel').remove();
    });
    //保存图片模块
    modalAddImage.on('click','.add-image-el',function(){
      SetImageData.saveImageModule(mIndex,modulePannelId,modalAddImage);
      modalAddImage.modal('hide');
    });
    //保存文本模块
    modalAddText.on('click','.add-text-el',function(){
      SetTextData.saveTextModule(mIndex,modulePannelId,modalAddText);
      modalAddText.modal('hide');
    });
  },
  addSwiperModule:function(mIndex,listData){
    var that = this;
    var cmsModuleSwiperTpl = $('#cmsModuleSwiperTemplate'),
        moduleWrap = $('.fl-module[moduleid='+mIndex+']'),
        htmlStr;
    //数据格式
    if(!listData){
      var listData = {
        'typeid':that.setModulePid('.f-module-pannel'),
        'swiperwidth':'100%',
        'swiperheight':'100%',
        'slideList':[{
          linkurl:'#',
          imgurl:'/'
        },{
          linkurl:'#',
          imgurl:'/'
        }]
      };
    }
    htmlStr = cmsModuleSwiperTpl.tmpl(listData);//模版数据渲染
    moduleWrap.append(htmlStr);//置入模版
    that.setSwiper(listData.typeid);//初始化swiper
  },
  setSwiper:function(id){
    new Swiper('.module-swiper-'+id, {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: 5000,
        autoplayDisableOnInteraction: false
    });
    //Swiper插入发布页面底部模版中
    var scriptTpl = '<script>new Swiper(".module-swiper-'+id+'", {'+
        'pagination: ".swiper-pagination",'+
        'paginationClickable: true,'+
        'spaceBetween: 30,'+
        'centeredSlides: true,'+
        'autoplay: 5000,'+
        'autoplayDisableOnInteraction: false'+
    '});</script>';
    var cmsFooterTemplate = $('#cmsFooterTemplate');
    cmsFooterTemplate.append(scriptTpl);
  },
  hoverShow:function(meEl){
    var meId = meEl.attr('typeid'),
        meName = meEl.attr('modulename');
    var meTitle = '';        
    if(meName == 'swiper'){
      meTitle = '轮播图';
    }else if(meName == 'image'){
      meTitle = '图片';
    }else if(meName == 'text'){
      meTitle = '文本';
    }else if(meName == 'regular'){
      meTitle = '定期理财';
    }
    meEl.addClass('fm-on');//添加颜色框虚线
    var cmsFsetTpl = $('#cmsFmoduleSetTemplate').tmpl({'title':meTitle});
    meEl.append(cmsFsetTpl);//添加布局操作层
  },
  hiddenOn:function(meEl){
    meEl.removeClass('fm-on');
    $('.fm-set').remove();
  },
  setModulePid:function(wrapEl){
    //动态生成不重复的模块ID
    var modulePannel = $(wrapEl),
        modulepIds = [0];   
    if(modulePannel){
      for(var i=0;i<modulePannel.length;i++){
        modulepIds.push(modulePannel.eq(i).attr('typeid'));
      }  
    }
    var modulepid = parseInt(modulepIds._max()) + 1; 
    return modulepid;
  }

}

//update image module data
var SetImageData = {
  initImageDialog:function(moduleid,pannelid,dialogwrap){
    this.areaTpl = $('.send-tpl');
    //获取数据(动态时用ajax get json)
    this.getUrl = getAddressUrlParam();//获取地址栏参数对象
    var pageId = this.getUrl.id;//取page id
    this.renderData(pageId,pannelid,dialogwrap);//渲染数据

  },
  renderData:function(pageId,pannelid,dialogwrap){
    //更新数据
    var setTable = $('.set-table',dialogwrap),
        elWidth = $('#maiImgWidth',dialogwrap),
        elHeight = $('#maiImgHeight',dialogwrap);
    $.ajax({
     type: "GET",
     url: "data/imagemodulelist.json",
     data: {'id':pageId},
     dataType: "json",
     success: function(resData){
        if(resData.success){
          var listData = resData.childrenList;
          if(listData.length > 0){
            $.each(listData,function(index,val){
              if(val.childrenId == pannelid){
                var childrenWidth = val.childrenWidth,
                    childrenHeight = val.childrenHeight,
                    childrenLink = val.childrenLink,
                    childrenUrl = val.childrenUrl;
                elWidth.val(childrenWidth);
                elHeight.val(childrenHeight);
                //setTable.find('.st-url').attr('src',childrenUrl);
                setTable.find('.st-link').val(childrenLink);
              }else{
                elWidth.val('');
                elHeight.val('');
                //setTable.find('.st-url').attr('src','');
                setTable.find('.st-link').val('');
              }
            });
          }

        }
      }
    });
    //布局设置背景上传插件
    if (setTable.find('.st-url').data('fileinput')) {
      setTable.find('.st-url').fileinput('destroy');//创建前先销毁
    }
    //初始化上传插件
    setTable.find('.st-url').fileinput({
        language: 'zh',
        uploadUrl: "/uploadfiles",
        //showCaption: false,
        showPreview:true,
        maxFileCount: 1,
        autoReplace: true,
        maxFileCount: 1,
        allowedFileExtensions: ["jpg", "png", "gif"],
        //initialPreview: ["<img style='height:80px' src='/'>"],
        //initialCaption: 'Initial-Image.jpg'
        previewSettings:{
                image: {width: "100%", height: "80px"}
        }
    });
  },
  saveImageModule:function(moduleid,pannelid,dialogwrap){
    var that = this;
    var setTable = $('.set-table',dialogwrap),
        elWidth = $.trim($('#maiImgWidth',dialogwrap).val()),
        elHeight = $.trim($('#maiImgHeight',dialogwrap).val()),
        sibList = $('.sib-list',setTable);
        linkurl = $('.st-link',sibList).val(),
        imgurl = $('.st-url',sibList).val();
    //提交数据(动态ajax post json)

    //更新模块
    var addImageModuleFun = new AddImageModuleFun({
      "childrenId":pannelid,
      "childrenWidth":elWidth,
      "childrenHeight":elHeight,
      "childrenLink":linkurl,
      "childrenUrl":imgurl
    });
    addImageModuleFun.init();
  }
};

//update text module data
var SetTextData = {
  initTextDialog:function(moduleid,pannelid,dialogwrap){
    this.areaTpl = $('.send-tpl');
    //获取数据(动态时用ajax get json)
    this.getUrl = getAddressUrlParam();//获取地址栏参数对象
    var pageId = this.getUrl.id;//取page id
    this.renderData(pageId,pannelid,dialogwrap);//渲染数据
    $('#elm1',dialogwrap).xheditor();
  },
  renderData:function(pageId,pannelid,dialogwrap){
    //更新数据
    var elContent = $('.set-text-content',dialogwrap),
        elWidth = $('#maiTextWidth',dialogwrap);
    $.ajax({
     type: "GET",
     url: "data/textmodulelist.json",
     data: {'id':pageId},
     dataType: "json",
     success: function(resData){
        if(resData.success){
          var listData = resData.childrenList;
          if(listData.length > 0){
            $.each(listData,function(index,val){
              if(val.childrenId == pannelid){
                var childrenWidth = val.childrenWidth,
                    childrenContent = val.childrenContent;
                elWidth.val(childrenWidth);
                elContent.val(childrenContent); 
              }else{
                elWidth.val('');
                elContent.val(''); 
              }
            });
          }

        }
      }
    });
  },
  saveTextModule:function(moduleid,pannelid,dialogwrap){
    var that = this;
    var elContent = $('.set-text-content',dialogwrap).val(),
        elWidth = $.trim($('#maiTextWidth',dialogwrap).val());
    if(elWidth == ''){
      elWidth = '100%';
    }
    //提交数据(动态ajax post json)

    //更新模块
    var addTextModuleFun = new AddTextModuleFun({
      "childrenId":pannelid,
      "childrenWidth":elWidth,
      "childrenContent":elContent
    });
    addTextModuleFun.init();
  }
};

//页面数据初始化渲染
var SetPageData = {
  init:function(){
    this.areaTpl = $('.send-tpl');
    this.getUrl = getAddressUrlParam();//获取地址栏参数对象
    var pageId = this.getUrl.id;//取page id
    this.loadData(pageId);//页面初始化加载
  },
  loadData:function(pageId){
    var that = this;
    $.ajax({
     type: "GET",
     url: "data/layoutlist.json",
     data: {'id':pageId},
     dataType: "json",
     success: function(resData){
        if(resData.success){
          var layoutList = resData.layoutList,
              pageBgColor = resData.pageBgColor,
              pageBgImage = resData.pageBgImage; 
          //render 布局模版
          if(layoutList.length > 0){
            $.each(layoutList,function(index,val){
              var addLayoutFun = new AddLayoutFun({
                "pageBgColor":pageBgColor,
                "pageBgImage":pageBgImage,
                "layoutId":val.layoutId,//必填
                "layoutName":val.layoutName,//必填
                "moduleId":val.moduleId,//必填
                "moduleId2":val.moduleId2,//必填
                "moduleId3":val.moduleId3,//必填
                "layoutInBgColor":val.layoutInBgColor,
                "layoutBgColor":val.layoutBgColor,
                "layoutBgImage":val.layoutBgImage
              });
              addLayoutFun.init();
              //render children
              that.renderChildrenData(val.children);
            });
          }
          //render 布局图片模块
          //that.loadImageData(pageId);
          //render 布局文本模块
          //that.loadTextData(pageId);
        }
      }
    });
  },
  renderChildrenData:function(listData){
    var that = this;
    //render children
    if(listData.length > 0){
      $.each(listData,function(cindex,cval){
        //render children pannel
        var addModuleFun = new AddModuleFun({
          "moduleId":cval.moduleId,
          "childrenId":cval.childrenId,
          "childrenType":cval.childrenType
        });
        addModuleFun.init();

        //render children content
        if(cval.childrenType == 'image'){
          //alert(cval.childrenType);
          var addImageModuleFun = new AddImageModuleFun({
            "childrenId":cval.childrenId,
            "childrenWidth":cval.childrenWidth,
            "childrenHeight":cval.childrenHeight,
            "childrenLink":cval.childrenLink,
            "childrenUrl":cval.childrenUrl
          });
          addImageModuleFun.init();
        }else if(cval.childrenType == 'text'){
          var addTextModuleFun = new AddTextModuleFun({
            "childrenId":cval.childrenId,
            "childrenWidth":cval.childrenWidth,
            "childrenContent":cval.childrenContent
          });
          addTextModuleFun.init();
        }
      });
    }
  },
  loadImageData:function(pageId){
    var that = this;
    $.ajax({
     type: "GET",
     url: "data/imagemodulelist.json",
     data: {'id':pageId},
     dataType: "json",
     success: function(resData){
        if(resData.success){
          var listData = resData.childrenList;
          if(listData.length > 0){
            $.each(listData,function(index,val){
              var addImageModuleFun = new AddImageModuleFun({
                "childrenId":val.childrenId,
                "childrenWidth":val.childrenWidth,
                "childrenHeight":val.childrenHeight,
                "childrenLink":val.childrenLink,
                "childrenUrl":val.childrenUrl
              });
              addImageModuleFun.init();
            });
          }

        }
      }
    });
  },
  loadTextData:function(pageId){
    var that = this;
    $.ajax({
     type: "GET",
     url: "data/textmodulelist.json",
     data: {'id':pageId},
     dataType: "json",
     success: function(resData){
        if(resData.success){
          var listData = resData.childrenList;
          if(listData.length > 0){
            $.each(listData,function(index,val){
              var addTextModuleFun = new AddTextModuleFun({
                "childrenId":val.childrenId,
                "childrenWidth":val.childrenWidth,
                "childrenContent":val.childrenContent
              });
              addTextModuleFun.init();
            });
          }

        }
      }
    });
  }
};
//页面数据 提交保存
var PagePostData = {
  init:function(){
    this.layoutWrap = $('.layout-wrap');
    this.getUrl = getAddressUrlParam();//获取地址栏参数对象
    var pageId = this.getUrl.id;//取page id
    
    //get 布局 list
    var layoutList = [];
    var layoutTpl = $('.f-layout-area',this.layoutWrap);
    if(layoutTpl){
      layoutTpl.each(function(index){
        var meEl = $(this);
        var childrenList = [];
        var thisObj = {
          "layoutId":meEl.find('.f-layout').attr('typeid'),
          "layoutName":meEl.find('.f-layout').attr('typename'),
          "moduleId":meEl.find('.fl-module').eq(0).attr('moduleid'),
          "moduleId2":meEl.find('.fl-module').eq(1).attr('moduleid'),
          "moduleId3":meEl.find('.fl-module').eq(2).attr('moduleid'),
          "layoutInBgColor":_rgbToHex(meEl.find('.f-layout').css('background-color')),
          "layoutBgColor":_rgbToHex(meEl.css('background-color')),
          "layoutBgImage":meEl.css('background-image').slice(5,-2),
          "children":[]
        };
        //get children list
        var childrenPannel = meEl.find('.f-module-pannel');
        if(childrenPannel){
          childrenPannel.each(function(){
            var cldMeEl = $(this),
                cldModuleName = cldMeEl.attr('modulename');
            var cldObj;
            if(cldModuleName == 'image'){
              cldObj = {
                "moduleId":cldMeEl.parent().attr('moduleid'),
                "childrenId":cldMeEl.attr('typeid'),
                "childrenType":cldMeEl.attr('modulename'),
                "childrenWidth":cldMeEl.find('.img-el').css('width').replace('px',''),
                "childrenHeight":cldMeEl.find('.img-el').css('height').replace('px',''),
                "childrenLink":cldMeEl.find('.img-el').attr('src'),
                "childrenUrl":cldMeEl.find('.img-el').parent('a').attr('href')
              }
            }else if(cldModuleName == 'text'){
              cldObj = {
                "moduleId":cldMeEl.parent().attr('moduleid'),
                "childrenId":cldMeEl.attr('typeid'),
                "childrenType":cldMeEl.attr('modulename'),
                "childrenWidth":cldMeEl.find('.text-container').css('width').replace('px',''),
                "childrenContent":cldMeEl.find('.text-container').html()
              }
            }
            thisObj.children.push(cldObj);
          });
        }
        layoutList.push(thisObj);
      });
    }

    var layoutData = {
      "success":true,
      "pageId":pageId,
      "pageBgColor":_rgbToHex(this.layoutWrap.css('background-color')),
      "pageBgImage":this.layoutWrap.css('background-image').slice(5,-2),
      "layoutList":layoutList
    };

    var str = JSON.stringify(layoutData); 
    var str1 = JSON.parse(str); 
    console.log(str);

    var getData = {
      'id':pageId,
      'layoutData':layoutData
    };


    //this.postData(pageId,getData);
  },
  postData:function(pageId,getData){
    $.ajax({
     type: "POST",
     url: "/",
     data: getData,
     dataType: "json",
     success: function(resData){
        if(resData.success){
          console.log('ok');
        }
      }
    });
  }
};

//添加布局封装
var AddLayoutFun = function(opts){
  this.defaults = {
    "elWrap":".layout-wrap",//必填
    "tplOneId":"#cmsOneAreaTemplate",//必填
    "tplTwoId":"#cmsTwoAreaTemplate",//必填
    "tplThreeId":"#cmsThreeAreaTemplate",//必填
    "pageBgColor":"",
    "pageBgImage":"",
    "layoutId":"1",//必填
    "layoutName":"banner",//必填
    "moduleId":"1",//必填
    "moduleId2":"",//必填
    "moduleId3":"",//必填
    "layoutInBgColor":"",
    "layoutBgColor":"",
    "layoutBgImage":""
  };
  this.options = $.extend({},this.defaults,opts);
};
AddLayoutFun.prototype = {
  init:function(){
    var that = this;
    //页面背景render
    that.renderPageBg(that.options.pageBgColor,that.options.pageBgImage);
    //布局模版render    
    var listData = {
      "layoutId":this.options.layoutId,
      "layoutName":this.options.layoutName,
      "layoutText":that.getLayoutText(this.options.layoutName),
      "moduleId":this.options.moduleId,
      "moduleId2":this.options.moduleId2,
      "moduleId3":this.options.moduleId3,
      "layoutInBgColor":this.options.layoutInBgColor,
      "layoutBgColor":this.options.layoutBgColor,
      "layoutBgImage":this.options.layoutBgImage
    };
    that.renderLayout(listData);
  },
  renderPageBg:function(bgcolor,bgimage){
    var that = this,
        tpl = $(that.options.elWrap);
    tpl.css('background-color',bgcolor);
    tpl.css('background-image','url('+bgimage+')');
  },
  renderLayout:function(listData){
    var that = this,
        layoutName = that.options.layoutName,
        tplOneId = that.options.tplOneId,
        tplTwoId = that.options.tplTwoId,
        tplThreeId = that.options.tplThreeId,
        layoutWrap = $(that.options.elWrap),
        htmlStr = '';    
    if(layoutName == 'banner'){
      htmlStr = $(tplOneId).tmpl(listData);
    }else if(layoutName == 'twocolumn'){
      htmlStr = $(tplTwoId).tmpl(listData);
    }else if(layoutName == 'threecolumn'){
      htmlStr = $(tplThreeId).tmpl(listData);
    }
    layoutWrap.append(htmlStr);
  },
  getLayoutText:function(layoutName){
    var layoutText = '';
    if(layoutName == 'banner'){
      layoutText = '通栏(990)';
    }else if(layoutName == 'twocolumn'){
      layoutText = '两列等分(490 x 490)';
    }else if(layoutName == 'threecolumn'){
      layoutText = '三等分(320x320x320)';
    }
    return layoutText;
  }
};

//添加模块布局封装
var AddModuleFun = function(opts){
  this.defaults = {
    "elWrap":".fl-module",
    "tplId":"#cmsModulePublicTemplate",
    "moduleId":'1',
    "childrenId":"1",
    "childrenType":"image"
  };
  this.options = $.extend({},this.defaults,opts);
};
AddModuleFun.prototype = {
  init:function(){
    var that = this;
    //模块布局render    
    var listData = {
      "childrenId":that.options.childrenId,
      "childrenType":that.options.childrenType
    };
    that.renderModule(listData);
  },
  renderModule:function(listData){
    var that = this,
        moduleId = that.options.moduleId,
        childrenId = that.options.childrenId,
        childrenType = that.options.childrenType,
        tplId = that.options.tplId,
        moduleWrap = $(that.options.elWrap+'[moduleid='+moduleId+']'),
        htmlStr = '';    
    htmlStr = $(tplId).tmpl(listData);
    moduleWrap.append(htmlStr);
  }
};

//添加图片模块封装
var AddImageModuleFun = function(opts){
  this.defaults = {
    "elWrap":".f-module-pannel",
    "tplId":"#cmsModuleImageTemplate",
    "childrenId":"1",
    "childrenWidth":"",
    "childrenHeight":"",
    "childrenLink":"/",
    "childrenUrl":"/"
  };
  this.options = $.extend({},this.defaults,opts);
};
AddImageModuleFun.prototype = {
  init:function(){
    var that = this;
    //模块render    
    var listData = {
      "childrenWidth":that.options.childrenWidth,
      "childrenHeight":that.options.childrenHeight,
      "childrenLink":that.options.childrenLink,
      "childrenUrl":that.options.childrenUrl
    };
    that.renderModule(listData);
  },
  renderModule:function(listData){
    var that = this,
        childrenId = that.options.childrenId,
        tplId = that.options.tplId,
        moduleWrap = $(that.options.elWrap+'[typeid='+childrenId+']'),
        htmlStr = '';    
    htmlStr = $(tplId).tmpl(listData);
    moduleWrap.html(htmlStr);
  }
};
//添加文本模块封装
var AddTextModuleFun = function(opts){
  this.defaults = {
    "elWrap":".f-module-pannel",
    "tplId":"#cmsModuleTextTemplate",
    "childrenId":"1",
    "childrenWidth":"100",
    "childrenContent":""
  };
  this.options = $.extend({},this.defaults,opts);
};
AddTextModuleFun.prototype = {
  init:function(){
    var that = this;
    //模块render    
    var listData = {
      "childrenWidth":this.options.childrenWidth,
      "childrenContent":this.options.childrenContent
    };
    that.renderModule(listData);
  },
  renderModule:function(listData){
    var that = this,
        childrenId = that.options.childrenId,
        tplId = that.options.tplId,
        moduleWrap = $(that.options.elWrap+'[typeid='+childrenId+']'),
        htmlStr = '';    
    htmlStr = $(tplId).tmpl(listData);
    moduleWrap.html(htmlStr);
  }
};