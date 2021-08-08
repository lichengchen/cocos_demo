// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        loading_label: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start_game: function() {
        this.loading_label.opacity = 255;
        cc.director.loadScene('sm');
        cc.director.preloadScene("s1");
        cc.director.preloadScene("s2");
        cc.director.preloadScene("s3");
    },
    
    game_1: function() {
        this.loading_label.opacity = 255;
        cc.director.pause();
        cc.director.loadScene('s1');
    },

    game_2: function() {
        this.loading_label.opacity = 255;
        cc.director.pause();
        cc.director.loadScene('s2');
    },

    game_3: function() {
        this.loading_label.opacity = 255;
        cc.director.pause();
        cc.director.loadScene('s3');
    },

    back_to_map: function() {
        cc.director.loadScene('sm');
    },

    back_to_begin: function() {
        cc.director.loadScene('s0');
    },

    start () {

    },

    // update (dt) {},
});
