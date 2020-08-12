import {createReadStream} from 'fs';
import * as Csv from 'csv-parser';


const toCamelCase = (str): string => {
    return str
        .replace(/\s(.)/g, function ($1) {
            return $1.toUpperCase();
        })
        .replace(/\s/g, '')
        .replace(/^(.)/, function ($1) {
            return $1.toLowerCase();
        });
};
const makeSkillSector = async (): Promise<any> => {
    return new Promise((resolve, reject): any => {
        try {
            const sectors: any[] = [];
            const all: any[] = [];
            const seci18: any = {};
            const skilli18: any = {};
            createReadStream('./dataupload/skills_original.csv')
                .pipe(Csv())
                .on('data', async (row) => {
                    if (row.Sector && row.Skill) {
                        row.Skill = row.Skill.trim().toLowerCase();
                        const camelSkill: string = toCamelCase(row.Skill);
                        skilli18[camelSkill] = row.Skill.charAt(0).toUpperCase() + row.Skill.slice(1);
                        const itemSkill: any = {
                            name: 'Config.Skills.' + camelSkill,
                            value: row.Skill
                        };
                        if (row.Sector === 'All sectors') {
                            all.push(itemSkill);
                            return;
                        }
                        row.Sector = row.Sector.trim().toLowerCase();
                        const camelSector: string = toCamelCase(row.Sector);
                        seci18[camelSector] = row.Sector.charAt(0).toUpperCase() + row.Sector.slice(1);
                        let f: boolean = false;
                        for (const a of sectors) {
                            if (a.value === row.Sector) {
                                let sf: boolean = false;
                                for (const b of a.skills) {
                                    if (b.value === row.Skillkil) {
                                        sf = true;
                                        break;
                                    }
                                }
                                if (!sf) {
                                    a.skills.push(itemSkill);
                                }
                                f = true;
                                break;
                            }
                        }
                        if (!f) {
                            sectors.push({
                                name: 'Config.Sectors.' + camelSector,
                                value: row.Sector,
                                skills: [
                                    itemSkill
                                ]
                            });
                        }
                    } else {
                        console.log('error found');
                    }
                })
                .on('end', () => {
                    console.log('done');
                    sectors.push(
                        {
                            name: 'Config.Sectors.others',
                            value: 'others',
                            skills:[]
                        }
                    );
                    all.push({
                        name: 'Config.Skills.others',
                        value:'others'
                    });
                 /*   for (const i of sectors) {
                        for (const d of all) {
                            let f: boolean = false;
                            for (const j of i.skills) {
                                if (j.value === d.value) {
                                    f = true;
                                    break;
                                }
                            }
                            if (!f) {
                                i.skills.push(d);
                            }
                        }
                        i.skills.push({
                            name: 'Config.Skills.others',
                            value:'others'
                        });
                    }*/
                    seci18.others = 'Others';
                    skilli18.others = 'Others';
                    resolve({sectors, seci18, skilli18,all});
                })
                .on('error', (err) => {
                    console.error(err);
                    reject();
                });
        } catch (error) {
            console.error(error);
            reject();
        }
    });
};

export default {
    makeSkillSector
};
