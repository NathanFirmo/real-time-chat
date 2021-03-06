import { getCustomRepository } from "typeorm";
import { Setting } from "../entities/Setting";
import { SettingsRepository } from "../repositories/SettingsRepository";

interface ISettingsCreate {
    chat: boolean;
    username: string;
}

class SettingsService {
    private settingsRepository: SettingsRepository

    constructor() {
        this.settingsRepository =
            getCustomRepository(SettingsRepository);
    }

    async create({ chat, username }: ISettingsCreate) {

        const userAlreadyExists = await this.settingsRepository.findOne({
            username,
        })

        if (userAlreadyExists) {
            throw new Error("User Already Exists!")
        }

        const setting = this.settingsRepository.create({
            chat,
            username,
        });

        await this.settingsRepository.save(setting);

        return setting
    }

    async findByUsername(username: string) {
        const settings = await this.settingsRepository.findOne({
            username,
        })
        return settings
    }
    async update(username: string, chat: boolean) {
        await this.settingsRepository
        .createQueryBuilder()
        .update(Setting)
        .set({ chat })
        .where("username = :username", { username })
        .execute()
    }
}

export { SettingsService }