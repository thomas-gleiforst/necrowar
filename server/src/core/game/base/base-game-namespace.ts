import { ISanitizableType } from "~/core/sanitize/sanitizable-interfaces";
import { Constructor, Immutable, TypedObject } from "~/utils";
import { BaseAI } from "./base-ai";
import { BaseGame } from "./base-game";
import { BaseGameManager } from "./base-game-manager";
import { BaseGameObjectFactory } from "./base-game-object-factory";
import { BaseGameSettingsManager } from "./base-game-settings";
import { BasePlayer } from "./base-player";

/** Namespace schema for a base game object */
export interface IBaseGameObjectSchema {
    /** The parent class name as a string. */
    parentClassName?: string;
    /** Key/value pairs of the attributes of this game object */
    attributes: TypedObject<ISanitizableType & {
        /** Optional default value for this attribute. */
        defaultValue?: unknown;
    }>;
    /** The functions that can be invoked for this game object and their arg & return schemas. */
    functions: TypedObject<IBaseGameObjectFunctionSchema>;
}

/** Namespace schema for functions that game objects can invoke */
export interface IBaseGameObjectFunctionSchema {
    /** Arguments to this function when called. */
    args: Array<ISanitizableType & {
        /** The name of the argument. */
        argName: string;
        /** The default value, if it is optional. */
        defaultValue?: unknown;
    }>;
    /** The schema about what type it returns. */
    returns: ISanitizableType;
    /** The value returned if the function call fails to validate. */
    invalidValue?: unknown;
}

/** The namespace all game index files should export */
export interface IBaseGameNamespace {
    /** The class for AIs playing this game. */
    AI: typeof BaseAI;
    /** The class for the Game this namespace wraps. */
    Game: typeof BaseGame;
    /** The class for the GameManager for the Game. */
    GameManager: typeof BaseGameManager;
    /** The factory for creating new GameObjects in this Game. */
    GameObjectFactory: typeof BaseGameObjectFactory;
    /** The settings manager class for this Game. */
    GameSettingsManager: typeof BaseGameSettingsManager;
    /** The class of the Player instances in this game. */
    Player: Constructor<BasePlayer>;
    /** The unique identifying string for this Game. */
    gameName: string;
    /** The schema about what GameObjects are valid in game settings for this Game. */
    gameObjectsSchema: {
        /** The AI's schema */
        AI: IBaseGameObjectSchema;
        /** The Game's base attribute's schema. */
        Game: IBaseGameObjectSchema;
        /** key/value pairs of the game object class name to their schema. */
        [gameObjectName: string]: IBaseGameObjectSchema | undefined;
    };
    /** A static settings manager for the Lobby to check initial settings sent. */
    gameSettingsManager: BaseGameSettingsManager;
    /** The hashed game temlate used to represent the version of this game */
    gameVersion: string;
}

/**
 * Should be invoked by all games to format their namespace correctly.
 *
 * @param namespace - The base game namespace to use. Will be mutated.
 * @returns The same game namespace ready to be used to play games with.
 */
export function makeNamespace<T extends IBaseGameNamespace>(
    namespace: Readonly<T>, // readonly as keys do not change, but their values do mutate a bit.
): Immutable<T> { // do not mutate the returned namespaces
    for (const obj of Object.values(namespace.gameObjectsSchema)) {
        if (!obj) {
            throw new Error(`unexpected non object in namespace ${namespace.gameName}`);
        }

        let depth = obj;
        while (depth.parentClassName) {
            // hook up the parent classes' attributes/functions
            const parent = namespace.gameObjectsSchema[depth.parentClassName];
            if (!parent) {
                throw new Error(`No parent for namespace ${namespace.gameName} recursively constructing!`);
            }

            Object.assign(obj.attributes, parent.attributes);
            Object.assign(obj.functions, parent.functions);
            depth = parent;
        }
    }

    return Object.freeze(namespace) as Immutable<T>;
}
