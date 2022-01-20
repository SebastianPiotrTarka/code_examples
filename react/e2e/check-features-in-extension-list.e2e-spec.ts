import { LoginPage } from '../../pageobjects/login.page';
import { SearchExtensionsPage } from '../../pageobjects/search-extensions.page';
import { apiVars } from '../../global';
import {openPage} from '../../helpers/global-helper';
import {aaServices, extensionServices, extensionServicesTooltips, faxServices} from "../../appData/extension-services";
import {expect} from "chai";

describe('Extension features on list view', () => {
    const loginPage: LoginPage = new LoginPage();
    const searchExtensionsPage: SearchExtensionsPage = new SearchExtensionsPage();

    before(async () => {
        await loginPage.open();
        await loginPage.loginAsCustomer(
            apiVars.testCustomer,
            apiVars.testCustomerPass,
        );
    });

    beforeEach(async () => {
        await openPage('extensions');
    });

    it('aa with services', async () => {
        await searchExtensionsPage.filterExtensions(
            searchExtensionsPage.extensionInput,
            '9043',
        );

        expect(await searchExtensionsPage.extensionIconType).to.exist;
        expect (await searchExtensionsPage.getExtensionTypeTooltip(0)).equal('Auto-attendant');

        const extensionServiceList = await searchExtensionsPage.getServicesInRow(0);
        expect(extensionServiceList).to.have.all.members(aaServices);

        for (let i = 0; i < extensionServiceList.length; i++) {
            const tooltipText = await searchExtensionsPage.getServiceTooltipInRowByIndexAndServiceName(0, extensionServiceList[i]);
            expect(tooltipText).equal(extensionServicesTooltips[extensionServices[i]]);
        }
    });

    it('extension with service', async ()=> {
        await searchExtensionsPage.filterExtensions(
            searchExtensionsPage.extensionInput,
            '9041',
        );

        expect(await searchExtensionsPage.extensionIconType).to.throw;

        const extensionServiceList = await searchExtensionsPage.getServicesInRow(0);
        expect(extensionServiceList).to.have.all.members(aaServices);

        for (let i = 0; i < extensionServiceList.length; i++) {
            const tooltipText = await searchExtensionsPage.getServiceTooltipInRowByIndexAndServiceName(0, extensionServiceList[i]);
            expect(tooltipText).equal(extensionServicesTooltips[extensionServices[i]]);
        }
    })

    it('extension with no service', async ()=> {
        await searchExtensionsPage.filterExtensions(
            searchExtensionsPage.extensionInput,
            '9044',
        );

        expect(await searchExtensionsPage.extensionIconType).to.throw;

        const extensionServiceList = await searchExtensionsPage.getServicesInRow(0);
        expect(extensionServiceList).to.be.empty;
    })

    it('fax with service', async ()=>{
        await searchExtensionsPage.filterExtensions(
            searchExtensionsPage.extensionInput,
            '9042',
        );

        expect(await searchExtensionsPage.extensionIconType).to.exist;
        expect (await searchExtensionsPage.getExtensionTypeTooltip(0)).equal('Fax-to-email');

        const extensionServiceList = await searchExtensionsPage.getServicesInRow(0);
        expect(extensionServiceList).to.have.all.members(faxServices);

        for (let i = 0; i < extensionServiceList.length; i++) {
            const tooltipText = await searchExtensionsPage.getServiceTooltipInRowByIndexAndServiceName(0, extensionServiceList[i]);
            expect(tooltipText).equal(extensionServicesTooltips[extensionServices[i]]);
        }
    })
});
