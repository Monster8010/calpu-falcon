import {
  createRepositoryContext,
  type RepositoryOptions,
  type SharedStateStore,
} from "../core";
import { ConfigurationRepository } from "./configuration-repository";
import { DemoDataRepository } from "./demo-data-repository";
import { DepartmentsRepository } from "./departments-repository";
import { EntrepreneursRepository } from "./entrepreneurs-repository";
import { FairsRepository } from "./fairs-repository";
import { InstitutionalPostsRepository } from "./institutional-posts-repository";
import { MarketplaceRepository } from "./marketplace-repository";
import { ModerationRepository } from "./moderation-repository";
import { StandRequestsRepository } from "./stand-requests-repository";
import { StandsRepository } from "./stands-repository";
import { StoriesRepository } from "./stories-repository";
import { TutorsRepository } from "./tutors-repository";

export interface CalpulliRepositories {
  departments: DepartmentsRepository;
  institutionalPosts: InstitutionalPostsRepository;
  stories: StoriesRepository;
  fairs: FairsRepository;
  stands: StandsRepository;
  standRequests: StandRequestsRepository;
  entrepreneurs: EntrepreneursRepository;
  marketplace: MarketplaceRepository;
  tutors: TutorsRepository;
  moderation: ModerationRepository;
  configuration: ConfigurationRepository;
  demoData: DemoDataRepository;
}

export function createRepositories(
  store: SharedStateStore,
  options: RepositoryOptions = {},
): CalpulliRepositories {
  const context = createRepositoryContext(store, options);

  return {
    departments: new DepartmentsRepository(context),
    institutionalPosts: new InstitutionalPostsRepository(context),
    stories: new StoriesRepository(context),
    fairs: new FairsRepository(context),
    stands: new StandsRepository(context),
    standRequests: new StandRequestsRepository(context),
    entrepreneurs: new EntrepreneursRepository(context),
    marketplace: new MarketplaceRepository(context),
    tutors: new TutorsRepository(context),
    moderation: new ModerationRepository(context),
    configuration: new ConfigurationRepository(context),
    demoData: new DemoDataRepository(context),
  };
}
