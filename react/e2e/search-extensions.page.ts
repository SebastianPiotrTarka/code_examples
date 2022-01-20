import { BasePage } from './page';
import {
    extensionElements,
    filteredByDIDNumberList,
    filteredByExtensionAndNameList,
    paginationList,
} from '../appData/extension-content';
import {
    getProgressbar,
    getSearchButton,
    getTableElement,
} from '../helpers/global-helper';
import { extensionServices } from '../appData/extension-services';

export class SearchExtensionsPage extends BasePage {
    get extensionInput() {
        return $('[data-qa="filter-by-extension"] input');
    }

    get extensionIconType() {
        return $('[data-qa="extenion-type-icon"]');
    }

    get nameInput() {
        return $('[data-qa="filter-by-name"] input');
    }

    get DIDNumberInput() {
        return $('[data-qa="filter-by-didNumber"] input');
    }

    get emailInput() {
        return $('[data-qa="filter-by-email"] input');
    }

    get bottomPager() {
        return $('.MuiToolbar-gutters');
    }

    async setInputValue(elem: Promise<WebdriverIO.Element>, value: string) {
        await (await elem).setValue(value);
    }

    async getInputValue(elem: Promise<WebdriverIO.Element>) {
        const element = await elem;
        return await element.getValue();
    }

    async setExtensionInputValue(extension: string) {
        await (await this.extensionInput).setValue(extension);
    }

    async setNameInputValue(name: string) {
        await (await this.nameInput).setValue(name);
    }

    async filterByExtensionAndName(extension: string, name: string) {
        await this.setExtensionInputValue(extension);
        await this.setNameInputValue(name);
        await (await getSearchButton()).waitForClickable();
        await (await getSearchButton()).click();
        await (await getProgressbar()).waitForDisplayed({ reverse: true });
    }

    async getExtensionElement(row: number, elem: string) {
        const extensionId = await getTableElement(row, extensionElements[elem]);
        return await extensionId.getText();
    }

    async getExtensionNameInRow(index: number) {
        const extensionName = await getTableElement(
            index,
            extensionElements['name'],
        );
        await extensionName.moveTo();
        const name = await extensionName.$('[data-qa="name-value"]');

        return name.getText();
    }

    async getExtensionEmailInRow(index: number) {
        const extensionName = await getTableElement(
            index,
            extensionElements['name'],
        );
        await extensionName.moveTo();
        const name = await extensionName.$('[data-qa="email-value"]');

        return name.getText();
    }

    async getFilteredByExtensionAndNameList() {
        const extensionsList = [];
        for (let i = 0; i < filteredByExtensionAndNameList.length; i++) {
            extensionsList.push({
                id: await this.getExtensionElement(i, 'id'),
                item: await this.getExtensionNameInRow(i),
            });
        }
        return extensionsList;
    }

    async filterExtensions(elem: Promise<WebdriverIO.Element>, value: string) {
        await this.setInputValue(elem, value);
        await (await getSearchButton()).waitForClickable();
        await (await getSearchButton()).click();
        await (await getProgressbar()).waitForDisplayed({ reverse: true });
    }

    async getDIDNumberBadgeInRow(index: number) {
        const extensionDIDnumber = await getTableElement(
            index,
            extensionElements['numbers'],
        );
        return await extensionDIDnumber.$('[data-qa="badge-did-numbers"]');
    }

    async getDIDNumberInRow(index: number) {
        let numbers: string;
        const badge = await (
            await this.getDIDNumberBadgeInRow(index)
        ).isExisting();
        if (badge) {
            await (await this.getDIDNumberBadgeInRow(index)).moveTo();
            const tooltip = await super.getTooltip();
            numbers = (await tooltip.getText()).split('\n').join(', ');
            const extensionId = await getTableElement(
                index,
                extensionElements['id'],
            );
            await extensionId.moveTo();
            await tooltip.waitForDisplayed({ reverse: true });
        } else {
            const extensionDIDnumber = await getTableElement(
                index,
                extensionElements['numbers'],
            );
            numbers = await extensionDIDnumber.getText();
        }
        return numbers;
    }

    async getFilteredByDIDNumberList() {
        const extensionsList = [];
        for (let i = 0; i < filteredByDIDNumberList.length; i++) {
            extensionsList.push({
                id: await this.getExtensionElement(i, 'id'),
                item: await this.getDIDNumberInRow(i),
            });
        }
        return extensionsList;
    }

    async getFilteredByEmailList() {
        const extensionsList = [];
        extensionsList.push({
            id: await this.getExtensionElement(0, 'id'),
            item: await this.getExtensionEmailInRow(0),
        });
        return extensionsList;
    }

    async getServicesInRow(index: number) {
        const services = [];

        const extensionServicesElement = await getTableElement(
            index,
            extensionElements['emails'],
        );

        try {
            for (let i = 0; i < extensionServices.length; i++) {
                const temp = await (await extensionServicesElement).$(
                    `[data-qa="${extensionServices[i]}"]`
                );

                if (temp) {
                    services.push(await temp.getAttribute('data-qa'));
                }
            }
        } catch (e) {
            console.log('service not found');
        }

        return services;
    }

    async getExtensionTypeTooltip(index: number) {
        const typeElement = await getTableElement(
            index,
            extensionElements['type'],
        );
        await typeElement.moveTo();
        const tooltip = await super.getTooltip();
        const tooltipText = await tooltip.getText();

        await typeElement.moveTo({ yOffset: 100 });
        await tooltip.waitForDisplayed({ reverse: true });

        return tooltipText;
    }

    async getServiceTooltipInRowByIndexAndServiceName(
        index: number,
        serviceName: string,
    ) {
        const extensionServicesElement = await getTableElement(
            index,
            extensionElements['emails'],
        );
        const serviceHandler = await extensionServicesElement.$(
            `[data-qa="${serviceName}"]`,
        );

        await serviceHandler.moveTo();
        const tooltip = await super.getTooltip();
        const tooltipText = await tooltip.getText();

        await serviceHandler.moveTo({ yOffset: 50 });
        await tooltip.waitForDisplayed({ reverse: true });

        return tooltipText;
    }

    async getAccountStatusInRow(index: number) {
        const extensionStatus = await getTableElement(
            index,
            extensionElements['status'],
        );
        const dotColorProperty = await (
            await extensionStatus.$('[data-testid="status-icon"]')
        ).getCSSProperty('background-color');
        const status = {
            dot: dotColorProperty.parsed.rgba.toLowerCase(),
            text: await extensionStatus.getText(),
        };
        const extensionId = await getTableElement(
            index,
            extensionElements['id'],
        );
        await extensionId.moveTo();
        return status;
    }

    async getCallHistoryInRow(index: number) {
        const callHistory = await getTableElement(
            index,
            extensionElements['callHistory'],
        );
        const callHistoryIcon = await callHistory.$('svg');
        return await callHistoryIcon.isExisting();
    }

    async getFilteredList(listLength: number) {
        const extensionsList = [];
        for (let i = 0; i < listLength; i++) {
            const element = await getTableElement(
                i,
                extensionElements['numbers'],
            );
            await element.scrollIntoView();
            await element.click();
            extensionsList.push({
                id: await this.getExtensionElement(i, 'id'),
                name: await this.getExtensionNameInRow(i),
                numbers: await this.getDIDNumberInRow(i),
                emails: await this.getExtensionElement(i, 'emails'),
                status: await this.getAccountStatusInRow(i),
                icon: await this.getCallHistoryInRow(i),
            });
        }
        return extensionsList;
    }

    async getFilteredExtensionsList() {
        const extensionsList = [];
        for (let i = 0; i < paginationList.length; i++) {
            extensionsList.push(await this.getExtensionElement(i, 'id'));
        }
        return extensionsList;
    }

    async getBottomPagerText() {
        const text = await (await this.bottomPager).getText();
        return text.split(`\n`).join(' ');
    }

    async getBottomPagerTotalValue() {
        return parseInt((await this.getBottomPagerText()).split(' ')[6]);
    }

    async getReloadStatusButtonInRow(index: number) {
        const extensionStatus = await getTableElement(
            index,
            extensionElements['status'],
        );
        await extensionStatus.moveTo();
        return await extensionStatus.$('svg');
    }

    async clickReloadStatusButtonInRow(index: number) {
        const currentStatus = await (await getTableElement(0, 5)).getText();
        await (await this.getReloadStatusButtonInRow(index)).click();
        await browser.waitUntil(
            async () =>
                currentStatus !==
                (await (await getTableElement(0, 5)).getText()),
        );
    }
}

export const searchExtensionsPage = new SearchExtensionsPage();
