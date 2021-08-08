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
        id : 1,
        speed : 10,
        max_hp : 1,
        hpBar: cc.Sprite,
        label: cc.Label,
        game: cc.Node,
        atk: 2,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.die = false;
        this.game = Global.global_game;

        this.node.on('setID', this.setID, this);
        this.annimationComponent = this.getComponent(cc.Animation);
        this.node.on('get_damage', this.get_damage, this);
        this.node.on('go_ahead', this.go_ahead, this);

        this.routeX = new Array(-276, -185, -137, -41, -23, 123, 37, -134);
        this.routeY = new Array(-58, -30, 40, 80, 118, 32, -113, -123);

        this.schedule(this.search_enermy, 0.5);
    },

    start () {
        this.found = false;
        this.searching = false;
    },

    setID: function (id, flag = 0) {
        this.id = id;
        switch(this.id){
            case 0:{
                this.speed = 10;
                this.max_hp = 20;
                this.atk = 3;
                break;
            }
            case 1:{
                this.speed = 15;
                this.max_hp = 15;
                this.atk = 7;
                break;
            }
            case 2:{
                this.speed = 20;
                this.max_hp = 25;
                this.atk = 6;
                break;
            }
        }

        if(flag == 1){
            this.routeX = new Array(-1, -2, -132, 110, 175);
            this.routeY = new Array(159, 24, -85, -144, -99);
            
            //175, 110, -132
            //-99, -144, -85
        }
        else if(flag == 2){
            this.routeX = new Array(-185, -137, -41, -23, 123, 37, -134);
            this.routeY = new Array(-30, 40, 80, 118, 32, -113, -123);
        }
        else if(flag == 3){
            this.routeX = new Array(-190, -193, -60, 50, -190 ,-253);
            this.routeY = new Array(-100, 5,  7, 111, 118, 65);
        }
        else if(flag == 4){
            this.routeX = new Array(190, 193, 60, -50, 190 ,253);
            this.routeY = new Array(-100, 5,  7, 111, 118, 65);
        }
        else if(flag == 5){
            this.routeX = new Array(54, -80, -163, -101, 102, 170, 111);
            this.routeY = new Array(100, 9, -43, -102, -99, -37, 9);
        }

        this.nextX = this.routeX[1];
        this.nextY = this.routeY[1];

        this.hp = this.max_hp;
        this.nextMove = 0;
        this.on_move_finish();
    },

    move: function(delta_x, delta_y){
        if(delta_x < 0){
            this.node.scaleX = -1;
            this.hpBar.node.scaleX = -0.15;
        }else{
            this.node.scaleX = 1;
            this.hpBar.node.scaleX = 0.15;
        }
        var moveTime = Math.sqrt(Math.pow(delta_x, 2) + Math.pow(delta_y, 2))/this.speed;
        var moveAction = cc.moveBy(moveTime, delta_x, delta_y);
        //进行移动
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(moveAction, cc.callFunc(this.on_move_finish, this)));

        this.play_move();
    },

    on_move_finish: function(){

        if(this.found && this.otherNode){
            this.do_atk();
            if(this.node.x > this.otherNode.x){
                this.node.scaleX = -1;
            }
            else{
                this.node.scaleX = 1;
            }
            return;
        }
        this.nextX = this.routeX[this.nextMove];
        this.nextY = this.routeY[this.nextMove];
        this.move(this.nextX - this.node.x, this.nextY - this.node.y);
        if(this.nextMove == this.routeX.length-1){
            this.nextMove = 1;
        }
        else{
            this.nextMove ++;
        }
    },

    play_move: function () {
        this.annimationComponent.stop();
        var str = 'alli_'+this.id+'_move';
        this.annimationComponent.play(str);
    },

    play_attack: function () {
        this.annimationComponent.stop();
        var str = 'alli_'+this.id+'_attack';
        this.annimationComponent.play(str);
    },

    play_die: function () {
        if(this.die){
            return;
        }
        this.die = true;
        this.node.stopAllActions();
        this.annimationComponent.stop();
        var str = 'alli_'+this.id+'_die';
        this.annimationComponent.play(str);
        if(this.otherNode){
            this.otherNode.emit('go_ahead');
        }
        var disTime = 3;
        if(this.id == 2){
            disTime = 1;
        }
        this.scheduleOnce(this.disappear, disTime);
    },

    disappear: function() {
        if(this.id == 2){
            this.game.emit('reborn_knight', this.node.x, this.node.y);
        }
        this.node.destroy();
    },

    search_enermy: function() {
        if(this.searching){
            return;
        }
        this.searching = true;
        if(!this.die && this.found == false){
            if( this.game.getComponent('game')){
                var arr = this.game.getComponent('game').enermyList.children;
            }
            else if( this.game.getComponent('game2')){
                var arr = this.game.getComponent('game2').enermyList.children;
            }
            else if( this.game.getComponent('game3')){
                var arr = this.game.getComponent('game3').enermyList.children;
            }
                
            var startPos = cc.v2(this.node.x, this.node.y);
            var len=arr.length;
            var j=0;
            for(j=0 ; j < len && !this.found; j++) {
                if(arr[j].getComponent('enermy').id!=0 && !arr[j].getComponent('enermy').locked && arr[j].getComponent('enermy').alive){
                    var endPos = cc.v2(arr[j].x, arr[j].y);
                    let distance = startPos.sub(endPos).mag();
                    if(distance <= 40 && !this.found){
                        this.otherNode = arr[j];
                        this.found = true;
                        this.annimationComponent.stop();
                        this.otherNode.emit('on_found', this.node);
                        
                        if(this.node.x<this.otherNode.x){
                            var aim_x = this.otherNode.x - 20;
                        }
                        else{
                            var aim_x = this.otherNode.x + 20;
                        }
                        var aim_y = this.otherNode.y;
                        this.move(aim_x - this.node.x, aim_y - this.node.y);
                        break;
                    }
                }
            }
        }
        this.searching = false;
    },


    update (dt) {
    },

    do_atk: function() {
        if(this.node.x > this.otherNode.x){
            this.node.scaleX = -1;
            this.hpBar.node.scaleX = -0.15;
        }
        else{
            this.node.scaleX = 1;
            this.hpBar.node.scaleX = 0.15;
        }
        this.play_attack();
    },

    on_atk_finish: function() {
        if(this.otherNode && !this.otherNode.die){
            this.otherNode.emit('get_damage', this.atk);
        }
        else{
        }
    },

    get_damage: function(d) {       //from enermy
        this.hp -= d;
        if(this.hp<=0){
            this.hp = 0;
            this.hpBar.fillRange = 0;
            this.play_die();
        }
        else{
            this.hpBar.fillRange = this.hp / this.max_hp;
            this.do_atk();
        }
    },

    go_ahead: function() {
        if(this.die){
            return;
        }
        this.found = false;
        this.play_move();
        this.move(this.nextX - this.node.x, this.nextY - this.node.y);
    }
});
