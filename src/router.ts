import * as Hapi from '@hapi/hapi';
// import RegistrationRoutes from './api/registration/routes';
import EnrollmentRoutes from './api/enrollment/routes';
import Enrollment1Routes from './api/enrollment1/routes';
import AdminRoutes from './api/admin/routes';
import HealthRoutes from './api/health';
import PublicRoutes from './api/public';
import SkillRoutes from './api/skill/routes';
import EmployerRoutes from './api/employer/routes';
import EmployeeRoutes from './api/employee/routes';
import BusinessUserRoutes from './api/business/businessUser/routes';
import ProjectRoutes from './api/business/project/routes';
import Logger from './helper/logger';

class Router {
    public loadRoutes =  async (server: Hapi.Server): Promise<any> => {
        try {
            Logger.info('Router - Start adding routes.');
            await HealthRoutes.register(server);
            await PublicRoutes.register(server);
          //  await RegistrationRoutes.register(server);
            await EnrollmentRoutes.register(server);
            await Enrollment1Routes.register(server);
            await AdminRoutes.register(server);
            await SkillRoutes.register(server);
            await EmployerRoutes.register(server);
            await EmployeeRoutes.register(server);
            await BusinessUserRoutes.register(server);
            await ProjectRoutes.register(server);
            Logger.info('Router - Finish adding routes.');
        } catch (error) {
            Logger.error(`Error in loading routers: `, error);
            throw error;
        }
    };
}
export default new Router();
