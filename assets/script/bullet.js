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
        speed : 200,
        ttl : 60,
        damage : 1
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.isMoving = false;
        this.yFlag = 0;
        
        this.delta_y = 0;
        this.delta_x = 0;
        this.node.on('setAim', this.setAim, this);
        this.annimationComponent = this.getComponent(cc.Animation);
    },

    setAim: function(scaleX, yFlag, damage){
        this.node.scaleX = scaleX;
        this.damage = damage;

        this.delta_x = this.speed * scaleX;

        if(yFlag != 0){
            this.delta_x = this.delta_x / 1.5;
            this.delta_y = this.speed * yFlag / 1.5;
            this.node.rotation = -45 * scaleX * yFlag;
        }
    },


    on_out_finish: function(){
        this.isMoving = true;
        this.annimationComponent.stop();
        this.annimationComponent.play('bullet_move');
    },

    on_boom_finish: function(){
        this.node.destroy();
    },

    start () {
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    update (dt){
        if(this.isMoving){
            this.node.x += this.delta_x*dt;
            this.node.y += this.delta_y*dt;
            this.ttl --;
            
            var boom = false;
            let W = 700;
            let H = 600;
            if(this.node.x<-W/2||this.node.x>W/2||this.node.y<-H/2||this.node.y>H/2){
                boom = true
            }

            if(this.ttl<=0){
                boom = true
            }

            if(boom){
                this.isMoving = false
                this.annimationComponent.stop();
                this.annimationComponent.play('bullet_boom');
                this.getComponent(cc.AudioSource).play();
            }
        }
        
    },

    /**
 * 当碰撞产生的时候调用
 * @param  {Collider} other 产生碰撞的另一个碰撞组件
 * @param  {Collider} self  产生碰撞的自身的碰撞组件
 */

    onCollisionEnter: function (other, self) {
        if(other.getComponent('enermy').alive){
            self.enabled = false;
            this.isMoving = false
            this.annimationComponent.stop();
            this.annimationComponent.play('bullet_boom');
            this.getComponent(cc.AudioSource).play();
        }
    },
    
});
