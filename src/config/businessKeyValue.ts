const keyvalue: any = {
    typeOfEmployer: [
        {
            name: 'Config.TypeOfEmployer.principal',
            value: 'principal'
        },
        {
            name: 'Config.TypeOfEmployer.contracting',
            value: 'contracting'
        }
    ],
    employmentType: [
        {
            name: 'Config.EmploymentType.contract',
            value: 'contract'
        },
        {
            name: 'Config.EmploymentType.permanent',
            value: 'permanent'
        }
    ],
    skillLevel:[
        {
            name: 'Config.SkillLevel.skilled',
            value: 'skilled'
        },
        {
            name: 'Config.SkillLevel.semiskilled',
            value: 'semiskilled'
        },
        {
            name: 'Config.SkillLevel.unskilled',
            value: 'unskilled'
        }
    ],
    applicationStatus:[
        {
            name: 'Config.ApplicationStatus.applied',
            value: 'applied'
        },
        {
            name: 'Config.ApplicationStatus.accept',
            value: 'accept'
        },
        {
            name: 'Config.ApplicationStatus.reject',
            value: 'reject'
        },
        {
            name: 'Config.ApplicationStatus.wishlist',
            value: 'wishlist'
        },
        {
            name: 'Config.ApplicationStatus.askMoSahay',
            value: 'askMoSahay'
        }
    ]
};

const getValueArray = (name: string): string[] => {
    const returnValue: string[] = [];
    if (keyvalue[name]) {
        for (const a of keyvalue[name]) {
            returnValue.push(a.value);
        }
    }
    return returnValue;
};

export default {
    keyvalue,
    getValueArray
};
