
//随机一个单位
export function RandomUnitInRange(entity: CDOTA_BaseNPC, range: number, target_team: UnitTargetTeam, unit_type: UnitTargetType) {
    let units = FindUnitsInRadius(entity.GetTeamNumber(), entity.GetOrigin(), entity, range, target_team, unit_type, 0, 0, false);
    if (units.length > 0) {
        let index = RandomInt(0, units.length - 1);
        return units[index];
    } else {
        return null;
    }
}
//最近单位
export function ClosestUnitInRange(entity: CDOTA_BaseNPC, range: number, target_team: UnitTargetTeam, unit_type: UnitTargetType) {
    let units = FindUnitsInRadius(entity.GetTeamNumber(), entity.GetOrigin(), entity, range, target_team, unit_type, UnitTargetFlags.NONE, FindOrder.CLOSEST, false);
    if (units.length > 0) {
        return units[0];
    } else {
        return null;
    }
}
//血量最少单位
export function WeakestUnitInRange(entity: CDOTA_BaseNPC, range: number, target_team: UnitTargetTeam, unit_type: UnitTargetType) {
    let units = FindUnitsInRadius(entity.GetTeamNumber(), entity.GetOrigin(), entity, range, target_team, unit_type, 0, 0, false);
    let minHP = 999999;
    let target = units[0];
    units.forEach(unit => {
        let distance = (entity.GetOrigin() - unit.GetOrigin() as Vector).Length();
        let HP = unit.GetHealth();
        if (unit.IsAlive() && (minHP == null || HP < minHP) && distance < range) {
            minHP = HP;
            target = unit;
        }
    });
    return target;
}
//最远单位
export function FarthestUnitInRange(entity: CDOTA_BaseNPC, range: number, target_team: UnitTargetTeam, unit_type: UnitTargetType) {
    let units = FindUnitsInRadius(entity.GetTeamNumber(), entity.GetOrigin(), entity, range, target_team, unit_type, UnitTargetFlags.NONE,FindOrder.CLOSEST, false);
    if (units.length > 0) {
        return units[0];
    } else {
        return null;
    }
}
//所有敌人（含魔免）
export function FindAllEnemiesInRange(entity: CDOTA_BaseNPC, range: number) {
    let enemies = FindUnitsInRadius(entity.GetTeamNumber(), entity.GetOrigin(), null, range, UnitTargetTeam.ENEMY, UnitTargetType.ALL, UnitTargetFlags.NONE,FindOrder.ANY, false);
    return enemies;
}
//血量百分比最少单位
export function HealthPercentLowestUnitInRange(entity: CDOTA_BaseNPC, range: number, target_team: UnitTargetTeam, unit_type: UnitTargetType) {
    let units = FindUnitsInRadius(entity.GetTeamNumber(), entity.GetOrigin(), entity, range, target_team, unit_type, 0, 0, false);
    let minHP_pct = 999999;
    let target = null;
    units.forEach(unit => {
        let distance = (entity.GetOrigin() - unit.GetOrigin() as Vector).Length();
        let HP_pct = unit.GetHealthPercent();
        if (unit.IsAlive() && (minHP_pct == null || HP_pct < minHP_pct) && distance < range) {
            minHP_pct = HP_pct;
            target = unit;
        }
    });
    return target;
}

//尝试为圆形AOE技能寻找最佳释放目标
export function FindUnitForCircleAOE(entity: CDOTA_BaseNPC, range: number, radius: number, target_team: DOTA_UNIT_TARGET_TEAM, unit_type: DOTA_UNIT_TARGET_TYPE) {
    //对比单位周围的单位，找到最多的
    let temp = 0;
    let target = entity;
    let units = FindUnitsInRadius(entity.GetTeamNumber(), entity.GetOrigin(), entity, range, target_team, unit_type, 0, 0, false);
    units.forEach(unit => {
        let distance = (entity.GetOrigin() - unit.GetOrigin() as Vector).Length();
        let unit_num = FindUnitsInRadius(entity.GetTeamNumber(), unit.GetOrigin(), entity, radius, target_team, unit_type, 0, 0, false).length;
        if (unit.IsAlive() && (unit_num > temp) && distance < range) {
            temp = unit_num;
            target = unit;
        }
    });
    return target;
}

//尝试为直线AOE技能寻找最佳释放目标-如果是水人波浪或者沙王穿刺返回end_pos
export function FindUnitForLineAOE(entity: CDOTA_BaseNPC, range: number, radius: number, target_team: DOTA_UNIT_TARGET_TEAM, unit_type: DOTA_UNIT_TARGET_TYPE) {
    //目标单位的方向直线内的单位，找到最多的
    let temp = 0;
    let target = entity;
    let caster_point = entity.GetOrigin();
    let units = FindUnitsInRadius(entity.GetTeamNumber(), caster_point, entity, range, target_team, unit_type, 0, 0, false);
    let return_end_pos = caster_point;
    units.forEach(unit => {
        let unit_pos = unit.GetOrigin();
        let direction = ((unit.GetOrigin() - caster_point) as Vector).Normalized();
        let distance = ((caster_point - unit_pos) as Vector).Length();
        let end_pos = (unit_pos + direction * (range - distance)) as Vector;
        let unit_num = FindUnitsInLine(
            entity.GetTeamNumber(),
            unit_pos,
            end_pos,
            null,
            radius,
            target_team,
            unit_type,
            UnitTargetFlags.MAGIC_IMMUNE_ENEMIES
        ).length;
        if (unit.IsAlive() && (unit_num > temp)) {
            temp = unit_num;
            target = unit;
            return_end_pos = end_pos;
        }
    });
    return target;
}
