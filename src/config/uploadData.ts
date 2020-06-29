import {createReadStream} from 'fs';
import * as Csv from 'csv-parser';
import {connection, Model} from 'mongoose';

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
                            newModal.state= 'uttar pradesh';
                            if(row.city){
                                newModal.city = row.city.toLowerCase();
                            }
                            if(row.district){
                                newModal.district = row.district.toLowerCase();
                            }
                            if(row.adress){
                                newModal.address = row.adress;
                            }
                            newModal.contactNo = row.contactNo;
                            newModal.uploadRef = 'upload1';
                            const skills: any[] =[];
                            try {
                                row.skills = JSON.parse(row.skills);
                               for(const skill of row.skills)
                               {
                                   const s= await modal.findOne({name: skill.toLowerCase()}).exec();
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
                    }
                      else if(! (row.contactNo && row.contactNo.length===10 && /^[6-9]+[0-9]+$/.test(row.contactNo) )){
                             console.log('contactNo error');
                          clean = false;
                      }
                    else if (!row.skills) {
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
                    if(clean){
                        for (const skill of row.skills) {
                            try {
                                const res: any = await modal.findOne({name: skill.toLowerCase()}).exec();
                                if (!res) {
                                    console.log('skill not found '+ skill );
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

export default {
    verifySkill,
    makeEmployee,
    verifyEmployee
};
