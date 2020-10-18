import {createReadStream} from 'fs';
import * as Csv from 'csv-parser';
import * as Joi from '@hapi/joi';
import {connection, Model} from 'mongoose';
import BusinessKeyValue from '../config/businessKeyValue';

const test = async (): Promise<void> => {
    try {
       /* const modal: Model<any> = connection.model('test1');
        const a =  new modal({
            a:'asa1',
            c:7,
            b:10
        });
        await a.save();*/
   /*    const schema =  Joi.object().keys({
               employmentType:Joi.string().required().valid( ...BusinessKeyValue.getValueArray('employmentType')),
               durationInDays:Joi.number().when('employmentType', { is: 'contract', then: Joi.number().required().integer().min(1).max(3650), otherwise: Joi.forbidden() })
       }).required();
        const {error, value} = schema.validate({
            employmentType:'permanent',
            durationInDays:1
        });*/

        const schema =   Joi.object().keys({
            version: Joi.number().required().integer().valid(...[1]),
            path: Joi.string().required().trim().min(1).max(10000),
            intercomRegion:Joi.string().trim().min(1).max(10000).allow(''),
            baseURL: Joi.string().when('intercomRegion', { is: Joi.string().required() , then: Joi.optional(), otherwise: Joi.string().required().uri().trim().min(1).max(10000).allow('') })
        });
        const {error, value} = schema.validate({
            version:'1',
            path:'ss',
            baseURL:''

        });
        if (error) {
           console.log(error);
        }
    } catch (error) {
        console.error(error);
    }
};

const verifySkill = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            const modal: Model<any> = connection.model('skill');
            createReadStream('./dataupload/skill.csv')
                .pipe(Csv())
                .on('data', async (row) => {
                    if (row.skill) {
                        try {
                            const newModal: any = new modal({name: row.skill.toLowerCase(), uploadRef: '1'});
                            await newModal.save();
                        } catch (err) {
                            console.log(`Error in: ${JSON.stringify(row)}`);
                            console.error(err);
                        }
                    }
                })
                .on('end', () => {
                    resolve();
                })
                .on('error', () => {
                    reject();
                });
        } catch (error) {
            reject();
        }
    });
};
const makeEmployee = async (): Promise<any> => {
    return new Promise((resolve, reject) => {
        try {
            const modal: Model<any> = connection.model('skill');
            const employeeModal: Model<any> = connection.model('employee');
            createReadStream('./dataupload/agra1.csv')
                .pipe(Csv())
                .on('data', async (row) => {
                    try {
                        const newModal: any = new employeeModal({name: row.name.toLowerCase()});
                        newModal.state = 'uttar pradesh';
                        if (row.city) {
                            newModal.city = row.city.toLowerCase();
                        }
                        if (row.district) {
                            newModal.district = row.district.toLowerCase();
                        }
                        if (row.adress) {
                            newModal.address = row.adress;
                        }
                        newModal.contactNo = row.contactNo;
                        newModal.uploadRef = 'upload1';
                        const skills: any[] = [];
                        try {
                            row.skills = JSON.parse(row.skills);
                            for (const skill of row.skills) {
                                const s = await modal.findOne({name: skill.toLowerCase()}).exec();
                                skills.push({
                                    name: skill.toLowerCase(),
                                    link: s._id
                                });
                            }
                        } catch (e) {
                            console.log('skills parse error');
                            console.log(`Error in upper: ${JSON.stringify(row)}`);
                            console.error(e);
                        }
                        newModal.skills = skills;
                        await newModal.save();
                    } catch (err) {
                        console.log(`Error in: ${JSON.stringify(row)}`);
                        console.error(err);
                    }
                })
                .on('end', () => {
                    resolve('ok');
                })
                .on('error', () => {
                    reject();
                });
        } catch (error) {
            reject();
        }
    });
};
const verifyEmployee = async (): Promise<any> => {
    return new Promise((resolve, reject): any => {
        try {
            const modal: Model<any> = connection.model('skill');
            const errorOutput: any[] = [];
            createReadStream('./dataupload/agra1.csv')
                .pipe(Csv())
                .on('data', async (row) => {
                    let clean: boolean = true;
                    if (!(row.name && row.name.length > 0 && row.name.length < 1000)) {
                        console.log('name error');
                        clean = false;
                    }
                    /*     else if(!(row.state && row.state === 'up')){
                             console.log('state error');
                             clean = false;
                         }*/
                    else if (row.city && !(row.city.length > 0 && row.city.length < 10000)) {
                        console.log('city error');
                        clean = false;
                    } else if (row.district && !(row.district.length > 0 && row.district.length < 10000)) {
                        console.log('district error');
                        clean = false;
                    } else if (row.address && !(row.address.length > 0 && row.address.length < 100000)) {
                        console.log('address error');
                        clean = false;
                    } else if (!(row.contactNo && row.contactNo.length === 10 && /^[0-9]+$/.test(row.contactNo))) {
                        console.log('contactNo error');
                        clean = false;
                    } else if (!row.skills) {
                        console.log('skills error');
                        clean = false;
                    } else {
                        try {
                            row.skills = JSON.parse(row.skills);
                            if (!Array.isArray(row.skills)) {
                                console.log('skills parse error as array');
                                clean = false;
                            }
                        } catch (e) {
                            console.log('skills parse error');
                            clean = false;
                        }
                    }
                    if (clean) {
                        for (const skill of row.skills) {
                            try {
                                const res: any = await modal.findOne({name: skill.toLowerCase()}).exec();
                                if (!res) {
                                    console.log('skill not found ' + skill);
                                    clean = false;
                                }
                            } catch (err) {
                                clean = false;
                                console.error(err);
                            }
                        }
                    }
                    if (!clean) {
                        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaa1111111111');
                        errorOutput.push(row);
                        console.log(`Error in: ${JSON.stringify(row)}`);
                    }
                })
                .on('end', () => {
                    console.log('666666666666666666666666666666');
                    resolve(errorOutput);
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

const changeSector = async (): Promise<any> => {
    return new Promise(async (resolve, reject): Promise<any> => {
        try {
            const modal: any = connection.model('enrollment');
            const result: any = await modal.find(
                {
                    $or: [
                        {'skillData.sectors': 'auto sales, service & operations'},
                        {'skillData.sectors': 'domestic help'}
                    ]
                }
            ).exec();
            for (const item of result) {
                let f = false;
                const index = item.skillData.sectors.indexOf('auto sales, service & operations');
                if (index !== -1) {
                    item.skillData.sectors[index] = 'automobile';
                    f = true;
                }
                const index1 = item.skillData.sectors.indexOf('domestic help');
                if (index1 !== -1) {
                    item.skillData.sectors[index1] = 'home services';
                    f = true;
                }
                if (f) {
                    // console.log(item.skillData.sectors);
                    item.markModified('skillData.sectors');
                    await item.save();
                }
            }
            return resolve('done');
        } catch (error) {
            console.error(error);
            return reject();
        }
    });
};
const changeAdmin = async (): Promise<any> => {
    return new Promise(async (resolve, reject): Promise<any> => {
        try {
            const modal: any = connection.model('admin');
            const result: any = await modal.find(
            ).exec();
            for (const item of result) {
                item.scope = ['company'];
                if (item.verified) {
                    item.scope.push('admin');
                }
                item.verified = undefined;
              //  item.markModified('verified');
                console.log(item);
                await item.save();
            }
            return resolve('done');
        } catch (error) {
            console.error(error);
            return reject();
        }
    });
};
const verifyOthers = async (): Promise<any> => {
    return new Promise(async (resolve, reject): Promise<any> => {
        try {
            const modal: any = connection.model('enrollment');
            const result: any = await modal.find(
                {
                    $or: [
                        {'skillData.sectorsOther': {$exists: 1}},
                        {'skillData.skillsOther': {$exists: 1}},
                        {'skillData.preferredLocationsOther': {$exists: 1}},
                        {'healthData.symptomsOther': {$exists: 1}},
                        {'healthData.currentConditionOther': {$exists: 1}}
                    ]
                }
            ).exec();
            /*       const allSectors: any[] = KeyvalueConfig.getValueArray('skillsBySector');
                   const allSkills: any[] = KeyvalueConfig.getSkillArray();*/
            const r = [];
            const s = [];
            for (const item of result) {
                /* for (const sec of item.skillData.sectors) {
                     if (!allSectors.includes(sec)) {
                         if (!r.includes(sec)) {
                             r.push(sec);
                         }
                     }
                 }
                 for (const ski of item.skillData.skills) {
                     if (!allSkills.includes(ski)) {
                         if (!s.includes(ski)) {
                             s.push(ski);
                         }
                     }
                 }*/
                for (const i of ['skillData.sectorsOther', 'skillData.skillsOther', 'skillData.preferredLocationsOther', 'healthData.symptomsOther', 'healthData.currentConditionOther']) {
                    if (item[i.split('.')[0]] && item[i.split('.')[0]][i.split('.')[1]]) {
                        let work = item[i.split('.')[0]][i.split('.')[1]];
                        work = work.split(',');
                        work = work.filter(function (el) {
                            return el !== '';
                        });
                        work = work.map(function (el) {
                            return el.trim();
                        });
                        item[i.split('.')[0]][i.split('.')[1]] = work;
                        /* {
                             for (const p of work) {
                                 if (!(p && /^[a-z0-9]+([\sa-z0-9@&%:'./()_-])*$/i.test(p))) {
                                     console.log(p);
                                 }
                             }

                         }*/
                    }
                }
                // console.log(item);
                await item.save();
            }
            console.log(r);
            console.log(s);
            return resolve('done');
        } catch (error) {
            console.error(error);
            return reject();
        }
    });
};

export default {
    verifySkill,
    makeEmployee,
    verifyEmployee,
    verifyOthers,
    changeSector,
    changeAdmin,
    test
};
