import { SoftDeletableEntity, UserService } from "@medusajs/medusa";
import { EventBusService } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import { UserRepository } from "@medusajs/medusa/dist/repositories/user";
import AnalyticsConfigService from "@medusajs/medusa/dist/services/analytics-config";
import { FlagRouter } from "@medusajs/utils";

type UserServiceProps = {
  userRepository: typeof UserRepository;
  analyticsConfigService: AnalyticsConfigService;
  eventBusService: EventBusService;
  manager: EntityManager;
  featureFlagRouter: FlagRouter;
};

export declare enum UserRoles {
  /** The user is an admin.*/
  ADMIN = "admin",
  /*** The user is a team member.*/
  MEMBER = "member",
  /*** The user is a developer.*/
  DEVELOPER = "developer",
}

interface CreateUserInput {
  id?: string;
  email?: string;
  wallet_address: string;
  api_token?: string;
  role?: UserRoles;
  metadata?: Record<string, unknown>;
}
declare class User extends SoftDeletableEntity {
  role: UserRoles;
  wallet_address: string;
  email: string;
  /**
   * @apiIgnore
   */
  api_token: string;
  metadata: Record<string, unknown>;
  /**
   * @apiIgnore
   */
  private beforeInsert;
}

class AuthService extends UserService {
  constructor(container: UserServiceProps) {
    super(container);
  }

  // Override the create method as necessary
  // TODO: create user method commented out to build and push migrations
  // async create(user: CreateUserInput): Promise<User> {
  //   // Custom logic before calling the base implementation
  //   console.log("Custom logic before creating a user");
  //
  //   // Call the base class method
  //   const createdUser = await super.create(user);
  //
  //   // Custom logic after the base method
  //   console.log("Custom logic after creating a user");
  //
  //   return createdUser;
  // }

  // Override and disable all other methods from UserService
  list(): Promise<never> {
    throw new Error("Method not supported.");
  }

  retrieve(): Promise<never> {
    throw new Error("Method not supported.");
  }

  retrieveByApiToken(): Promise<never> {
    throw new Error("Method not supported.");
  }

  retrieveByEmail(): Promise<never> {
    throw new Error("Method not supported.");
  }

  hashPassword_(): Promise<never> {
    throw new Error("Method not supported.");
  }

  update(): Promise<never> {
    throw new Error("Method not supported.");
  }

  delete(): Promise<never> {
    throw new Error("Method not supported.");
  }

  setPassword_(): Promise<never> {
    throw new Error("Method not supported.");
  }

  generateResetPasswordToken(): Promise<never> {
    throw new Error("Method not supported.");
  }

  // Any other methods inherited from UserService should also be overridden in a similar manner
}

export default AuthService;
