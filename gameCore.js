// ========== 游戏核心引擎｜主公Lv0，全部归零开局 ==========
const GameCore = {
    // 【初始归零存档】全新账号 Lv0，一切从零开始
    getDefaultSave(){
        return {
            player: {
                name: "新主公",
                level: 0,    // ✅ 修改为主公Lv0
                exp: 0,
                power: 0,    // 总战力归零
                vip: 0
            },
            resource: {
                gold: 30000,    // 铜钱3万，新手微量起步
                food: 20000,     // 粮草2万
                ore: 10000,      // 矿石1万
                diamond: 50      // 元宝50
            },
            // 武将数组：初始为空，需要在将领页面招募
            generals: [],
            // 封地建筑全部归零，需要从零建造解锁
            buildings: {
                gov: 0,
                farm: 0,
                mine: 0,
                lumber: 0,
                techHouse: 0
            },
            // 任务系统：Lv0 适配新手引导任务
            taskList: [
                {id:1,name:"新手：建造官府",desc:"建造1级官府，解锁封地功能",reward:{gold:80000,food:50000,ore:30000,diamond:20},done:false},
                {id:2,name:"主线：招募第一名武将",desc:"前往将领页面招募一名武将",reward:{gold:100000,diamond:30},done:false},
                {id:3,name:"支线：建造农田",desc:"建造1级农田，开始自动产出粮草",reward:{food:80000},done:false}
            ],
            troopList: [],
            lastResourceTick: Date.now()
        }
    },

    // 读取存档，不存在则新建归零存档
    loadSave(){
        let save = localStorage.getItem("slgZeroSave");
        if(!save){
            const newSave = this.getDefaultSave();
            this.saveSave(newSave);
            return newSave;
        }
        return JSON.parse(save);
    },

    // 保存存档到本地存储
    saveSave(data){
        localStorage.setItem("slgZeroSave", JSON.stringify(data));
    },

    // 资源自动产出（建筑等级为0时，产量为0，必须先建造建筑）
    calcResourceTick(gameData){
        const b = gameData.buildings;
        const goldPerSec = b.gov * 2 + b.mine * 1.5;
        const foodPerSec = b.farm * 3;
        return {goldPerSec, foodPerSec};
    },

    runResourceAutoProduce(gameData){
        const now = Date.now();
        const deltaSec = Math.floor((now - gameData.lastResourceTick)/1000);
        if(deltaSec < 1) return gameData;
        const {goldPerSec, foodPerSec} = this.calcResourceTick(gameData);
        gameData.resource.gold += Math.floor(goldPerSec * deltaSec);
        gameData.resource.food += Math.floor(foodPerSec * deltaSec);
        gameData.lastResourceTick = now;
        return gameData;
    },

    // 计算总战力：所有武将战力之和
    calcTotalPower(gameData){
        let total = 0;
        gameData.generals.forEach(g=>{
            total += g.power;
        })
        gameData.player.power = total;
        return total;
    },

    // 工具：格式化数字 123456 → 12.3万
    formatNum(num){
        if(num >= 10000){
            return (num /10000).toFixed(1)+"万";
        }
        return num.toString();
    }
}

