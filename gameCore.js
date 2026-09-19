const Game = {
    // 纯白归零初始存档
    newSave(){
        return {
            player:{
                name:"新主公",
                level:0,
                exp:0,
                expNeed:1000, // 当前等级升级所需经验
                power:0,
                vip:0
            },
            resource:{
                gold:20000,
                food:10000,
                ore:5000,
                diamond:30
            },
            generals:[],
            buildings:{
                gov:0,
                farm:0,
                mine:0
            },
            taskList:[
                {id:1,name:"新手：建造官府",desc:"建造1级官府开启王朝之路",reward:{gold:60000,food:30000,diamond:15},done:false},
                {id:2,name:"新手：招募第一名武将",desc:"前往将领页面招募任意武将",reward:{gold:80000,diamond:20},done:false},
                {id:3,name:"新手：建造农田",desc:"建造农田开始产出粮草",reward:{food:50000},done:false}
            ],
            lastTime:Date.now()
        }
    },

    get(){
        let d = localStorage.getItem("slgSave");
        if(!d){
            let s = this.newSave();
            this.save(s);
            return s;
        }
        return JSON.parse(d);
    },

    save(data){
        localStorage.setItem("slgSave",JSON.stringify(data));
    },

    // 资源自动产出
    autoRes(){
        let d = this.get();
        let sec = Math.floor((Date.now() - d.lastTime)/1000);
        if(sec<1)return d;

        let goldS = d.buildings.gov * 1.5;
        let foodS = d.buildings.farm * 2.5;

        d.resource.gold += Math.floor(goldS*sec);
        d.resource.food += Math.floor(foodS*sec);
        d.lastTime = Date.now();
        this.save(d);
        return d;
    },

    // 计算总战力
    calcPower(){
        let d = this.get();
        let p = 0;
        d.generals.forEach(g=>p+=g.power);
        d.player.power = p;
        this.save(d);
        return p;
    },

    // ========== 新增：杀敌获取经验，自动判断升级 ==========
    addExp(killExp){
        let d = this.get();
        d.player.exp += killExp;

        // 循环判断是否满足升级
        while(d.player.exp >= d.player.expNeed){
            d.player.exp -= d.player.expNeed;
            d.player.level +=1;
            // 下一级需要嘅经验，逐级放大
            d.player.expNeed = Math.floor(d.player.expNeed * 1.4);
        }
        this.save(d);
        return d;
    },

    format(num){
        return num>=10000 ? (num/10000).toFixed(1)+"万" : num+"";
    }
}
