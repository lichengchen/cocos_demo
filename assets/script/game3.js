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
        bulletPrefab: {
            default: null,
            type: cc.Prefab,
        },

        lightningPrefab: {
            default: null,
            type: cc.Prefab,
        },

        rocketPrefab: {
            default: null,
            type: cc.Prefab,
        },

        enermyPrefab: {
            default: null,
            type: cc.Prefab,
        },

        alliPrefab:{
            default: null,
            type: cc.Prefab,
        },

        hero: {
            default: null,
            type: cc.Node,
        },

        house: {
            default: null,
            type: cc.Node,
        },

        house2: cc.Node,

        enermyList: cc.Node,

        infoNode: cc.Node,
        skillNode: cc.Node,
        skill_m: cc.Node,
        skill_n: cc.Node,

        label_life: cc.Label,
        label_point: cc.Label,
        label_coin: cc.Label,

        gameOverBtn: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.on_key_down, this);
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.on('spawnNewBullet', this.spawnNewBullet, this);
        this.node.on('add_point', this.add_point, this);
        this.node.on('minus_life', this.minus_life, this);
        this.node.on('skill_ready', this.skill_ready, this);
        this.node.on('reborn_knight', this.reborn_knight, this);
        window.Global = {global_game:cc.Node, infoNode: cc.Node, skillNode: cc.Node,};
        Global.global_game = this.node;
        Global.infoNode = this.infoNode;
        Global.skillNode = this.skillNode;

        this.enermyInfoNode = this.infoNode.getChildByName('enermyInfoNode');
        this.skillLabelNode = this.infoNode.getChildByName('label_skill');
        this.nameLabel = this.infoNode.getChildByName('label_name').getComponent(cc.Label);

        this.skill_q = this.skillNode.getChildByName('qNode');
        this.skill_w = this.skillNode.getChildByName('wNode');
        this.skill_e = this.skillNode.getChildByName('eNode');
        this.skill_r = this.skillNode.getChildByName('rNode');
        this.skill_a = this.skillNode.getChildByName('shotNode');

        cc.director.resume();
    },

    start () {
        this.mode = 'a';
        this.harder = 1;
        this.schedule(this.spawnNewEnermy, 4);
        this.spawnNewAlli(2);
        this.spawnNewAlli(1);
        this.spawnNewAlli(0);
    },

    onMouseDown: function(event) {
        let mouseType = event.getButton();
        if (mouseType === cc.Event.EventMouse.BUTTON_LEFT) {
            // 鼠标左键按下
            let mousePoint = event.getLocation();
            let heroPoint = this.node.convertToWorldSpaceAR(this.hero.getPosition());
            if(mousePoint!=heroPoint){
                var delta_x = mousePoint.x - heroPoint.x;
                var delta_y = mousePoint.y - heroPoint.y;
                this.hero.emit('shot', delta_x, delta_y, this.mode);
            }
        } else if (mouseType === cc.Event.EventMouse.BUTTON_MIDDLE) {
            // 鼠标中键按下
            this.spawnNewEnermy();

        } else if (mouseType === cc.Event.EventMouse.BUTTON_RIGHT) {
            // 鼠标右键按下
            let mousePoint = event.getLocation();
            let heroPoint = this.node.convertToWorldSpaceAR(this.hero.getPosition());
            if(mousePoint!=heroPoint){
                var delta_x = mousePoint.x - heroPoint.x
                var delta_y = mousePoint.y - heroPoint.y
                this.hero.emit('move',delta_x, delta_y);
            }
        }
    },

    on_key_down: function(event) {
        var flag = false;
        switch(event.keyCode){
            case cc.macro.KEY.q:
                if(this.skill_q.getComponent('skill').current_cd>=this.skill_q.getComponent('skill').cd){
                    this.hero.emit('use_skill', 'q');
                }else{
                    flag = true;
                }
            break;
            case cc.macro.KEY.w:
                if(this.skill_w.getComponent('skill').current_cd>=this.skill_w.getComponent('skill').cd){
                    this.hero.emit('use_skill', 'w');
                }else{
                    flag = true;
                }
            break;
            case cc.macro.KEY.e:
                if(this.skill_e.getComponent('skill').current_cd>=this.skill_e.getComponent('skill').cd){
                    this.hero.emit('use_skill', 'e');
                }else{
                    flag = true;
                }
            break;
            case cc.macro.KEY.r:
                if(this.skill_r.getComponent('skill').current_cd>=this.skill_r.getComponent('skill').cd){
                    this.hero.emit('use_skill', 'r');
                }else{
                    flag = true;
                }
            break;
            case cc.macro.KEY.m:
                if(this.skill_m.getComponent('skill').current_cd>=this.skill_m.getComponent('skill').cd){
                    var p = parseInt(this.label_coin.string);
                    if(p<100){
                        this.reset_display(-2);
                    }
                    else{
                        p-=100;
                        this.label_coin.string = p;
                        this.skill_m.emit('setCD0');
                        this.spawnNewAlli(1);
                    }
                }else{
                    flag = true;
                }
            break;
            case cc.macro.KEY.n:
                if(this.skill_n.getComponent('skill').current_cd>=this.skill_n.getComponent('skill').cd){
                    var p = parseInt(this.label_coin.string);
                    if(p<100){
                        this.reset_display(-2);
                    }
                    else{
                        p-=100;
                        this.label_coin.string = p;
                        this.skill_n.emit('setCD0');
                        this.spawnNewAlli(0);
                    }
                }else{
                    flag = true;
                }
            break;
            case cc.macro.KEY.b:
                if(this.skill_n.getComponent('skill').current_cd>=this.skill_n.getComponent('skill').cd){
                    var p = parseInt(this.label_coin.string);
                    if(p<1000){
                        this.reset_display(-2);
                    }
                    else{
                        p-=1000;
                        this.label_coin.string = p;
                        this.skill_n.emit('setCD0');
                        this.spawnNewAlli(2);
                    }
                }else{
                    flag = true;
                }
            break;
            case cc.macro.KEY.space:
                this.mode = 'a';
                this.reset_display();
                this.reset_skill_icons();
            break;
        }
        if(flag){
            this.reset_display(-1);
        }
    },

    skill_ready: function(s) {
        this.reset_skill_icons();
        switch(s){
            case 'q':
                this.skill_q.setContentSize(60, 60);
                this.mode = 'q';
                this.reset_display(1);
            break;
            case 'w':
                this.skill_w.setContentSize(60, 60);
                this.mode = 'w';
                this.reset_display(2);
            break;
            case 'e':
                this.skill_e.setContentSize(60, 60);
                this.mode = 'e';
                this.reset_display(3);
            break;
            case 'r':
                this.skill_r.setContentSize(60, 60);
                this.mode = 'r';
                this.reset_display(4);
            break;
        }
    },

    reset_skill_icons: function() {
        this.skill_q.setContentSize(48, 48);
        this.skill_w.setContentSize(48, 48);
        this.skill_e.setContentSize(48, 48);
        this.skill_r.setContentSize(48, 48);
    },

    reset_display: function(s = 0) {
        if(s == 0){
            this.enermyInfoNode.opacity = 0;
            this.skillLabelNode.opacity = 255;
            this.skillLabelNode.getComponent(cc.Label).string = '移动鼠标到单位/技能上来查看说明';
            this.nameLabel.string = '提示';
        }
        else if(s == -1){
            this.enermyInfoNode.opacity = 0;
            this.skillLabelNode.opacity = 255;
            this.skillLabelNode.getComponent(cc.Label).string = '技能未冷却';
            this.nameLabel.string = '提示';
        }
        else if(s == -2){
            this.enermyInfoNode.opacity = 0;
            this.skillLabelNode.opacity = 255;
            this.skillLabelNode.getComponent(cc.Label).string = '金钱不足，无法招募盟友';
            this.nameLabel.string = '提示';
        }
        else{
            this.enermyInfoNode.opacity = 0;
            this.skillLabelNode.opacity = 255;
            this.skillLabelNode.getComponent(cc.Label).string = '左键释放，空格取消';
            this.nameLabel.string = '当前：'+s+'技能';
        }
    },

    spawnNewBullet: function(scaleX, yFlag) {
        switch(this.mode){
            case 'a':
                // 使用给定的模板在场景中生成一个新节点
                var newBullet = cc.instantiate(this.bulletPrefab);
                // 将新增的节点添加到 Canvas 节点下面
                this.node.addChild(newBullet);
                newBullet.emit('setAim', scaleX, yFlag, 8);
                // 位置
                newBullet.setPosition(this.hero.getPosition().x, this.hero.getPosition().y+15);
                this.skill_a.emit('setCD0');
                break;
            case 'q':
                this.skill_q.setContentSize(48, 48);
                // 使用给定的模板在场景中生成一个新节点
                var newBullet = cc.instantiate(this.bulletPrefab);
                // 将新增的节点添加到 Canvas 节点下面
                this.node.addChild(newBullet);
                //newBullet.getComponent('bullet').ttl = 60;
                newBullet.getComponent('bullet').speed = 300;
                newBullet.emit('setAim', scaleX, yFlag, 15);
                // 位置
                newBullet.setPosition(this.hero.getPosition().x, this.hero.getPosition().y+15);
                this.mode = 'a';
                this.skill_q.emit('setCD0');
                this.reset_display();
                break;
            case 'w':
                this.skill_w.setContentSize(48, 48);
                this.mode = 'a';
                this.skill_w.emit('setCD0');
                this.schedule(function() {
                    this.attack_rocket(scaleX, yFlag-15);
                }, 0.4, 7);
                this.reset_display();
                break;
            case 'e':
                this.skill_e.setContentSize(48, 48);
                // 使用给定的模板在场景中生成一个新节点
                var newBullet = cc.instantiate(this.bulletPrefab);
                // 将新增的节点添加到 Canvas 节点下面
                this.node.addChild(newBullet);
                newBullet.getComponent('bullet').ttl = 600;
                newBullet.getComponent('bullet').speed = 0;
                newBullet.emit('setAim', scaleX, yFlag, 15);
                newBullet.setPosition(this.hero.getPosition().x, this.hero.getPosition().y+15);
                this.mode = 'a';
                this.skill_e.emit('setCD0');
                this.reset_display();
                break;
            case 'r':
                this.skill_r.setContentSize(48, 48);
                this.mode = 'a';
                this.skill_r.emit('setCD0');
                this.t = 250
                this.schedule(this.greatBoom, 0.5, 5);
                this.schedule(this.greatRocket, 1, 2);
                this.reset_display();
                break;
        }
    },

    attack_rocket: function(x, y) {
        // 使用给定的模板在场景中生成一个新节点
        var newRocket = cc.instantiate(this.rocketPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newRocket);
        newRocket.setPosition(this.hero.getPosition().x, this.hero.getPosition().y+15);
        newRocket.emit('move', x, y);
    },


    spawnNewEnermy: function() {
        // 使用给定的模板在场景中生成一个新节点
        var newEnermy = cc.instantiate(this.enermyPrefab);

        // 将新增的节点添加到 enermyList 节点下面
        this.enermyList.addChild(newEnermy);
        newEnermy.parent = this.enermyList;
        var id = Math.floor(Math.random() * 10);
        var flag = Math.floor(Math.random() * 4)+3;

        // 位置
        var y=0;
        var x=0;
        
        if(flag == 3){
            y = Math.floor(Math.random() * 40);
            y = y - 155;
            x = -345;
        }
        else if(flag == 4){
            y = Math.floor(Math.random() * 40);
            y = y - 155;
            x = 345;
        }
        else if(flag == 5 || flag == 6){
            x = Math.floor(Math.random() * 40);
            x = -20 + x;
            y = -240;
        }
        newEnermy.setPosition(x, y);
        newEnermy.emit('setID', id, flag);
        newEnermy.getComponent('enermy').max_hp *= this.harder;
        newEnermy.getComponent('enermy').hp *= this.harder;
    },

    spawnBoss: function() {
        var newEnermy = cc.instantiate(this.enermyPrefab);
        this.enermyList.addChild(newEnermy);
        newEnermy.parent = this.enermyList;
        var id = Math.floor(Math.random() * 2)+10;
        var flag = Math.floor(Math.random() * 4)+3;
        var y = Math.floor(Math.random() * 50);
         // 位置
         var y=0;
         var x=0;
         
         if(flag == 3){
             y = Math.floor(Math.random() * 40);
             y = y - 155;
             x = -345;
         }
         else if(flag == 4){
             y = Math.floor(Math.random() * 40);
             y = y - 155;
             x = 345;
         }
         else if(flag == 5 || flag == 6){
             x = Math.floor(Math.random() * 40);
             x = -20 + x;
             y = -240;
         }
         newEnermy.setPosition(x, y);
         newEnermy.emit('setID', id, flag);
         newEnermy.getComponent('enermy').max_hp *= this.harder;
         newEnermy.getComponent('enermy').hp *= this.harder;

         this.harder *= 2;
    },

    spawnNewAlli: function(id) {
        var newAlli = cc.instantiate(this.alliPrefab);
        this.node.addChild(newAlli);
        newAlli.parent = this.node;
        var flag = 0;
        if(id == 1){
            this.house.getComponent(cc.Animation).play('house_openDoor');
            newAlli.setPosition(this.house.x, this.house.y);
            flag = 3;
        }
        else if(id == 0){
            this.house2.getComponent(cc.Animation).play('castle_openDoor');
            newAlli.setPosition(this.house2.x, this.house2.y);
            flag = 4;
        }
        else if(id == 2){
            this.house2.getComponent(cc.Animation).play('castle_openDoor');
            newAlli.setPosition(this.house2.x-10, this.house2.y);
            flag = 5;
        }
        
        newAlli.emit('setID', id, flag);
        
    },

    add_point: function(coin) {
        var p = parseInt(this.label_point.string);
        p++;
        this.label_point.string = p;
        if(p!=0 && p%50 == 0){
            this.spawnBoss();
        }
        var p = parseInt(this.label_coin.string);
        p = p+coin;
        this.label_coin.string = p;
    },

    minus_life: function() {
        var p = parseInt(this.label_life.string);
        p--;
        this.label_life.string = p;
        if(p<=0){
            cc.director.pause();
            var btn = cc.instantiate(this.gameOverBtn);
            this.node.addChild(btn);
            btn.setPosition(0,0);
        }
    },

    reborn_knight: function(x, y) {
        var newLightning = cc.instantiate(this.lightningPrefab);
        this.node.addChild(newLightning);
        newLightning.parent = this.node;
        newLightning.setPosition(x, y);
        this.spawnNewAlli(2);
    },

    //for skills
    greatRocket: function() {
        var newBullet = cc.instantiate(this.rocketPrefab);
        this.node.addChild(newBullet);
        newBullet.getComponent('rocket').speed = 280;
        newBullet.setPosition(349, 200);
        newBullet.emit('move', -1, -4);

        newBullet = cc.instantiate(this.rocketPrefab);
        this.node.addChild(newBullet);
        newBullet.getComponent('rocket').speed = 160;
        newBullet.setPosition(349, 299);
        newBullet.emit('move', -2, -1);

        newBullet = cc.instantiate(this.rocketPrefab);
        this.node.addChild(newBullet);
        newBullet.getComponent('rocket').speed = 280;
        newBullet.setPosition(349, 280);
        newBullet.emit('move', -4, -1);

        newBullet = cc.instantiate(this.rocketPrefab);
        this.node.addChild(newBullet);
        newBullet.getComponent('rocket').speed = 160;
        newBullet.setPosition(250, 299);
        newBullet.emit('move', -1, -8);

        newBullet = cc.instantiate(this.rocketPrefab);
        this.node.addChild(newBullet);
        newBullet.getComponent('rocket').speed = 280;
        newBullet.setPosition(180, 299);
        newBullet.emit('move', -1, -6);
    },

    greatBoom: function() {
        this.greatBoomx(349, this.t);
        this.greatBoomx(250, this.t);
        this.greatBoomx(160, this.t);
        this.greatBoomx(349, this.t);
        this.greatBoomy(299, this.t);
        this.greatBoomy(200, this.t);
        this.greatBoomy(150, this.t);
        this.t -=20;
    },

    greatBoomx: function(x ,t) {
        var newBullet = cc.instantiate(this.bulletPrefab);
        this.node.addChild(newBullet);
        newBullet.getComponent('bullet').ttl = t;
        newBullet.getComponent('bullet').speed = 100;
        newBullet.emit('setAim', -1, -1, 3);
        newBullet.setPosition(x, 299);

        newBullet = cc.instantiate(this.bulletPrefab);
        this.node.addChild(newBullet);
        newBullet.getComponent('bullet').ttl = t+50;
        newBullet.getComponent('bullet').speed = 200;
        newBullet.emit('setAim', -1, -1, 3);
        newBullet.setPosition(x-99, 299);

        newBullet = cc.instantiate(this.bulletPrefab);
        this.node.addChild(newBullet);
        newBullet.getComponent('bullet').ttl = t-50;
        newBullet.getComponent('bullet').speed = 150;
        newBullet.emit('setAim', -1, -1, 3);
        newBullet.setPosition(x-180, 299);

        newBullet = cc.instantiate(this.bulletPrefab);
        this.node.addChild(newBullet);
        newBullet.getComponent('bullet').ttl = t-20;
        newBullet.getComponent('bullet').speed = 160;
        newBullet.emit('setAim', -1, -1, 3);
        newBullet.setPosition(x-230, 299);

        newBullet = cc.instantiate(this.bulletPrefab);
        this.node.addChild(newBullet);
        newBullet.getComponent('bullet').ttl = t+30;
        newBullet.getComponent('bullet').speed = 130;
        newBullet.emit('setAim', -1, -1, 3);
        newBullet.setPosition(x-250, 299);
    },

    greatBoomy: function(y,t) {
        var newBullet = cc.instantiate(this.bulletPrefab);
        this.node.addChild(newBullet);
        newBullet.getComponent('bullet').ttl = t;
        newBullet.getComponent('bullet').speed = 100;
        newBullet.emit('setAim', -1, -1, 3);
        newBullet.setPosition(349, y);

        newBullet = cc.instantiate(this.bulletPrefab);
        this.node.addChild(newBullet);
        newBullet.getComponent('bullet').ttl = t+50;
        newBullet.getComponent('bullet').speed = 200;
        newBullet.emit('setAim', -1, -1, 3);
        newBullet.setPosition(349, y-30);

        newBullet = cc.instantiate(this.bulletPrefab);
        this.node.addChild(newBullet);
        newBullet.getComponent('bullet').ttl = t-50;
        newBullet.getComponent('bullet').speed = 150;
        newBullet.emit('setAim', -1, -1, 3);
        newBullet.setPosition(349, y-100);

        newBullet = cc.instantiate(this.bulletPrefab);
        this.node.addChild(newBullet);
        newBullet.getComponent('bullet').ttl = t-20;
        newBullet.getComponent('bullet').speed = 160;
        newBullet.emit('setAim', -1, -1, 3);
        newBullet.setPosition(349, y-80);

        newBullet = cc.instantiate(this.bulletPrefab);
        this.node.addChild(newBullet);
        newBullet.getComponent('bullet').ttl = t+30;
        newBullet.getComponent('bullet').speed = 130;
        newBullet.emit('setAim', -1, -1, 3);
        newBullet.setPosition(349, y-200);
    },
    // update (dt) {},
});
