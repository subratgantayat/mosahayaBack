import * as Hapi from '@hapi/hapi';
import RegistrationRoutes from './api/registration/routes';
import EnrollmentRoutes from './api/enrollment/routes';
import AdminRoutes from './api/admin/routes';
import SeverHealthRoutes from './api/health';
import SeverFileRoutes from './api/file';
import SkillRoutes from './api/skill/routes';
import EmployerRoutes from './api/employer/routes';
import EmployeeRoutes from './api/employee/routes';
import Logger from './helper/logger';

export default class Router {
    public static loadRoutes =  async (server: Hapi.Server): Promise<any> => {
        try {
            Logger.info('Router - Start adding routes.');
            await SeverHealthRoutes.register(server);
            await SeverFileRoutes.register(server);
            await RegistrationRoutes.register(server);
            await EnrollmentRoutes.register(server);
            await AdminRoutes.register(server);
            await SkillRoutes.register(server);
            await EmployerRoutes.register(server);
            await EmployeeRoutes.register(server);
            Logger.info('Router - Finish adding routes.');
        } catch (error) {
            Logger.error(`Error in loading routers: ${error}`);
            throw error;
        }
    };
}
