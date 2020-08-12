const stringConstants: any = {
    global: {
        CREATED_SUCCESSFULLY: 'Created successfully',
        ERROR_IN_CREATING: 'Error in creating',
        READ_SUCCESSFULLY: 'Read successfully',
        ERROR_IN_READING: 'Error in reading',
        UPDATED_SUCCESSFULLY: 'Updated successfully',
        ERROR_IN_UPDATING: 'Error in updating',
        DELETED_SUCCESSFULLY: 'Deleted successfully',
        NO_RECORD_TO_DELETE: 'No record found to delete',
        INVALID_CAPTCHA: 'Invalid captcha or please clear your browser cache and retry'
    },
    health: {
        HEALTH_CHECK: 'Method that returns server\'s health'
    },
    public: {
        FILE: 'Method that returns static files',
        APP_VERSION:'App version',
        KEY_VALUE:'Method to get all key value pairs for dropdown'
    },
    registration:{
        CREATE:'Method to register',
        MESSAGING:'Method for messaging for google pub/sub',
        INVALID_ID_DOB: 'Invalid enrollment id or date of birth',
        VIEW_FORM: 'Method to get registered data by enrollment id and date of birth'
    },
    enrollment:{
        CREATE:'Method to create enrollment',
        FINDALL:'Method to search enrollment',
        INVALID_ID: 'Invalid enrollment ID',
        VIEW_FORM: 'Method to get enrollment data by enrollment ID'
    },
    admin:{
        CREATE:'Method to signup admin',
        SIGNIN:'Method to signin admin',
        PHONE_NUMBER_EXIST: 'Phone number already exist',
        SIGNIN_SUCCESSFULLY: 'Sign in successfully',
        INVALID_LOGIN: 'Invalid phone number or password'
    },
    employer:{
        CREATE:'Method to signup employer',
        SIGNIN:'Method to signin employer',
        PHONE_NUMBER_EXIST: 'Phone number already exist',
        SIGNIN_SUCCESSFULLY: 'Sign in successfully',
        INVALID_LOGIN: 'Invalid phone number or password'
    },
    employee:{
        SEARCH:'Method to search employee',
        FIND_LIMIT:'Method to search limited employee for download',
        INVALID_QUERY_PARAM: 'Invalid query param'
    },
    skill:{
        FINDALL:'Method to get all skills'
    },
    business:{
        businessUser:{
            EMAIL_EXIST:'Method to check if email already exists for business user',
            SIGNUP:'Method to signup business user',
            SIGNIN:'Method to signin business user',
            CHANGE_PASSWORD:'Method to change password for business user',
            PROFILE_EDIT:'Method to edit own profile for business user',
            PROFILE_GET_SELF:'Method to get own profile for business user',
            PROFILE_SEARCH:'Method to search other profiles for business user',
            PROFILE_ONE:'Method to get profile detail by id for business user',
            VERIFY_TOKEN:'Method to verify access token',
            success:{
                SIGNUP_SUCCESSFUL: 'Sign up successful',
                SIGNIN_SUCCESSFUL: 'Sign in successful',
                PASSWORD_CHANGE_SUCCESSFUL:'Password change successful',
                PROFILE_EDIT_SUCCESSFUL:'Profile update successful',
                PROFILE_READ_SUCCESSFUL:'Profile read successful',
                PROFILE_SEARCH_SUCCESSFUL:'Profile search successful',
                PROFILE_ONE_SUCCESSFUL:'Profile read successful'
            },
            error:{
                EMAIL_ALREADY_TAKEN: 'Email already taken',
                INVALID_LOGIN: 'Invalid email or password',
                EMAIL_NOT_VERIFIED: 'Email not verified',
                INACTIVE_USER: 'Account is not active',
                PASSWORD_NOT_MATCHED: 'Current password is incorrect',
                SAME_PASSWORD: 'No difference between current password and new password',
                INVALID_USER: 'Invalid user',
                NO_PROFILE: 'No profile found',
                INVALID_PROFILE_USER:''
            }
        },
        project:{
            CREATE:'Method to create a project for business user',
            EDIT:'Method to edit a project for business user',
            FIND_SELF:'Method to search own projects for business user',
            FIND_ONE_SELF:'Method to get own single project by id for business user',
            FIND:'Method to search others projects for business user',
            FIND_ONE:'Method to get other single project by id for business user',
            APPLY_PROJECT:'Method to apply to project for business user',
            GET_APPLY_PROJECT:'Method to get projects to which user has applied for business user',
            success:{
                PROJECT_CREATE_SUCCESSFUL:'Project create successful',
                PROJECT_EDIT_SUCCESSFUL:'Project update successful',
                PROJECT_READ_SUCCESSFUL:'Project read successful',
                PROJECT_SEARCH_SUCCESSFUL:'Project search successful',
                PROJECT_APPLY_SUCCESSFUL:'Project apply successful'
            },
            error:{
                TITLE_ALREADY_TAKEN: 'Another project exists with the same title',
                ALREADY_APPLIED:'You have already applied to the project',
                INVALID_PROJECT: 'Invalid project',
                INVALID_PROJECT_TO_APPLY: 'Invalid project or can cant apply to this project or already applied'
            }
        }
    }
};

export default stringConstants;
