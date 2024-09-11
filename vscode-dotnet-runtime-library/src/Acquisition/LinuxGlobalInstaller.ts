/* --------------------------------------------------------------------------------------------
 *  Licensed to the .NET Foundation under one or more agreements.
*  The .NET Foundation licenses this file to you under the MIT license.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { IGlobalInstaller } from './IGlobalInstaller';
import { DotnetDistroSupportStatus, LinuxVersionResolver } from './LinuxVersionResolver';
import { IAcquisitionWorkerContext } from './IAcquisitionWorkerContext';
import { IUtilityContext } from '../Utils/IUtilityContext';
import { IDotnetAcquireContext } from '../IDotnetAcquireContext';

export class LinuxGlobalInstaller extends IGlobalInstaller {
    private version : string;
    private linuxSDKResolver : LinuxVersionResolver;

    constructor(acquisitionContext : IAcquisitionWorkerContext, utilContext : IUtilityContext, fullySpecifiedDotnetVersion : string)
    {
        super(acquisitionContext, utilContext);
        this.linuxSDKResolver = new LinuxVersionResolver(acquisitionContext, utilContext);
        this.version = fullySpecifiedDotnetVersion;
    }

    public async installSDK(): Promise<string>
    {
        await this.linuxSDKResolver.Initialize();

        return this.linuxSDKResolver.ValidateAndInstallSDK(this.version);
    }

    public async uninstallSDK() : Promise<string>
    {
        await this.linuxSDKResolver.Initialize();

        return this.linuxSDKResolver.UninstallSDK(this.version);
    }

    public async getExpectedGlobalSDKPath(specificSDKVersionInstalled : string, installedArch : string) : Promise<string>
    {
        await this.linuxSDKResolver.Initialize();

        const dotnetFolder = await (await this.linuxSDKResolver.distroCall()).getDotnetVersionSupportStatus(specificSDKVersionInstalled, 'sdk') === DotnetDistroSupportStatus.Distro ?
            (await this.linuxSDKResolver.distroCall()).getExpectedDotnetDistroFeedInstallationDirectory() :
            (await this.linuxSDKResolver.distroCall()).getExpectedDotnetMicrosoftFeedInstallationDirectory();
        return dotnetFolder;
    }

    public async getGlobalSdkVersionsInstalledOnMachine(): Promise<string[]>
    {
        await this.linuxSDKResolver.Initialize();

        return (await this.linuxSDKResolver.distroCall()).getInstalledDotnetSDKVersions();
    }

}