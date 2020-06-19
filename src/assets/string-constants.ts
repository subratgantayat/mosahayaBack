const stringConstants: any = {
    global: {
        CREATED_SUCCESSFULLY: 'created successfully',
        ERROR_IN_CRAETING: 'Error in creating',
        READ_SUCCESSFULLY: 'read successfully',
        ERROR_IN_READING: 'Error in reading',
        UPDATED_SUCCESSFULLY: 'updated successfully',
        ERROR_IN_UPDATING: 'Error in updating',
        DELETED_SUCCESSFULLY: 'deleted successfully',
        NO_RECORD_TO_DELETE: 'No record found to delete'
    },
    health: {
        HEALTH_CHECK: 'Method that returns server\'s health'
    },
    registration:{
        CREATE:'Method to register',
        KEYVALUE:'Method to get all key value pairs for dropdown',
        MESSAGING:'Method for messaging for google pub/sub',
        INVALID_ID_DOB: 'Invalid enrollment id or date of birth',
        VIEW_FORM: 'Method to get registered data by enrollment id and date of birth'
    },
    enrollment:{
        CREATE:'Method to create enrollment',
        FINDALL:'Method to search enrollment',
        INVALID_ID: 'Invalid enrollment ID',
        VIEW_FORM: 'Method to get enrollment data by enrollment ID',
        INVALID_CAPTCHA: 'Invalid captcha or please clear your browser cache and retry'
    },
    admin:{
        CREATE:'Method to signup admin',
        SIGNIN:'Method to signin admin',
        PHONE_NUMBER_EXIST: 'Phone number already exist',
        SIGNIN_SUCCESSFULLY: 'Sign in successfully',
        INVALID_LOGIN: 'Invalid phone number or password'
    }
};

export default stringConstants;
