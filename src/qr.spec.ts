/* eslint-disable @typescript-eslint/no-explicit-any */
import { QRBillValidationError } from './errors/validation-error';
import { BbitQRBillVersion, BbitQRBillAddressType } from '@bbitgmbh/bbit.banking-utils';
import { BbitQRCodeGenerator } from './qr';
import _ from 'lodash';
import { defaultData } from './data';

const qr = new BbitQRCodeGenerator();

describe('QR test', (): void => {
  it('Unsupported version should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    cloned.version = 'unsupported' as BbitQRBillVersion;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toEqual(new Error(`QR bill version ${cloned.version} is not supported`));
  });

  it('Missing account (IBAN) should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    delete cloned.account;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(2);
    expect(error.getValidationErrors()[0]).toBe("Property 'account' has to be defined");
  });

  it('Invalid account (IBAN) should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    cloned.account = 'CH2830000011623852951';
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(1);
    expect(error.getValidationErrors()[0]).toBe(`Property 'account' (IBAN) ${cloned.account} is not valid`);
  });

  it('Missing creditor should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    delete cloned.creditor;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(1);
    expect(error.getValidationErrors()[0]).toBe("Property 'creditor' has to be defined");
  });

  it('Missing creditor properties should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    cloned.creditor = {} as any;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(5);
    expect(error.getValidationErrors()[0]).toBe("Property 'type' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[1]).toBe("Property 'name' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[2]).toBe("Property 'postalCode' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[3]).toBe("Property 'locality' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[4]).toBe("Property 'country' on 'creditor' has to be defined");
  });

  it('Missing structured creditor properties should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    cloned.creditor = {
      type: BbitQRBillAddressType.STRUCTURED,
    } as any;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(4);
    expect(error.getValidationErrors()[0]).toBe("Property 'name' on 'creditor' has to be defined");
    // expect(error.getValidationErrors()[1]).toBe("Property 'street' on 'creditor' has to be defined");
    // expect(error.getValidationErrors()[2]).toBe("Property 'buildingNumber' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[1]).toBe("Property 'postalCode' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[2]).toBe("Property 'locality' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[3]).toBe("Property 'country' on 'creditor' has to be defined");
  });

  it('Missing unstructured creditor properties should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    cloned.creditor = {
      type: BbitQRBillAddressType.UNSTRUCTURED,
    } as any;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(4);
    expect(error.getValidationErrors()[0]).toBe("Property 'name' on 'creditor' has to be defined");
    // expect(error.getValidationErrors()[1]).toBe("Property 'address' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[1]).toBe("Property 'postalCode' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[2]).toBe("Property 'locality' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[3]).toBe("Property 'country' on 'creditor' has to be defined");
  });

  it('Missing debtor should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    delete cloned.debtor;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(1);
    expect(error.getValidationErrors()[0]).toBe("Property 'debtor' has to be defined");
  });

  it('Missing debtor properties should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    cloned.debtor = {} as any;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(5);
    expect(error.getValidationErrors()[0]).toBe("Property 'type' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[1]).toBe("Property 'name' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[2]).toBe("Property 'postalCode' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[3]).toBe("Property 'locality' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[4]).toBe("Property 'country' on 'debtor' has to be defined");
  });

  it('Missing structured debtor properties should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    cloned.debtor = {
      type: BbitQRBillAddressType.STRUCTURED,
    } as any;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(4);
    expect(error.getValidationErrors()[0]).toBe("Property 'name' on 'debtor' has to be defined");
    // expect(error.getValidationErrors()[1]).toBe("Property 'street' on 'debtor' has to be defined");
    // expect(error.getValidationErrors()[2]).toBe("Property 'buildingNumber' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[1]).toBe("Property 'postalCode' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[2]).toBe("Property 'locality' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[3]).toBe("Property 'country' on 'debtor' has to be defined");
  });

  it('Missing unstructured debtor properties should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    cloned.debtor = {
      type: BbitQRBillAddressType.UNSTRUCTURED,
    } as any;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(4);
    expect(error.getValidationErrors()[0]).toBe("Property 'name' on 'debtor' has to be defined");
    // expect(error.getValidationErrors()[1]).toBe("Property 'address' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[1]).toBe("Property 'postalCode' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[2]).toBe("Property 'locality' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[3]).toBe("Property 'country' on 'debtor' has to be defined");
  });

  it('Missing reference should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    delete cloned.reference;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(1);
    expect(error.getValidationErrors()[0]).toBe("Property 'reference' has to be defined");
  });

  it('Wrong reference should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    cloned.reference = '1234';
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(1);
    expect(error.getValidationErrors()[0]).toBe("Property 'reference' is not valid (QR-IBAN)");
  });

  it('Missing currency should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    delete cloned.currency;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(1);
    expect(error.getValidationErrors()[0]).toBe("Property 'currency' has to be defined");
  });

  it('Missing amount should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    delete cloned.amount;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(1);
    expect(error.getValidationErrors()[0]).toBe("Property 'amount' has to be defined");
  });

  it('generateQRCodeContent should work', (): void => {
    const data = qr.generateQRCodeContent(defaultData);
    expect(data).toBeDefined();
    expect(data).toMatchSnapshot();

    const switchedAddresses = _.cloneDeep(defaultData);
    const save = switchedAddresses.debtor;
    switchedAddresses.debtor = defaultData.creditor;
    switchedAddresses.creditor = save;
    const data2 = qr.generateQRCodeContent(switchedAddresses);
    expect(data2).toBeDefined();
    expect(data2).toMatchSnapshot();

    const withoutMessage = _.cloneDeep(defaultData);
    delete withoutMessage.unstructuredMessage;
    delete withoutMessage.billInformation;
    const data3 = qr.generateQRCodeContent(withoutMessage);
    expect(data3).toBeDefined();
    expect(data3).toMatchSnapshot();
  });

  it('generate should work', async (): Promise<void> => {
    const data = await qr.generate(defaultData);
    expect(data).toBeDefined();
    expect(data).toMatchSnapshot();
  });
});
