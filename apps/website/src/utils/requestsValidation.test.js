import {
  validateMembershipRenewal,
  validateFoundationClassRegistration,
  validateMembershipStatusChange,
  validateFoundationClassStatusChange,
  membershipRenewalValidationRules,
  foundationClassValidationRules
} from './requestsValidation';

describe('RequestsValidation', () => {
  // Membership Renewal Validation Tests
  describe('validateMembershipRenewal', () => {
    test('should validate a valid membership renewal', () => {
      const validRenewal = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        birthday: '1990-01-01',
        memberSince: '2020',
        agreeToTerms: true,
        status: 'pending'
      };
      
      const { isValid, errors } = validateMembershipRenewal(validRenewal);
      expect(isValid).toBe(true);
      expect(errors).toEqual({});
    });
    
    test('should fail validation for an invalid membership renewal', () => {
      const invalidRenewal = {
        fullName: '',
        email: 'not-an-email',
        phone: '123',
        status: 'invalid-status'
      };
      
      const { isValid, errors } = validateMembershipRenewal(invalidRenewal);
      expect(isValid).toBe(false);
      expect(Object.keys(errors).length).toBeGreaterThan(0);
      expect(errors.fullName).toBeDefined();
      expect(errors.email).toBeDefined();
      expect(errors.birthday).toBeDefined();
      expect(errors.memberSince).toBeDefined();
      expect(errors.agreeToTerms).toBeDefined();
    });
    
    test('should validate conditional fields correctly', () => {
      const renewalWithAddressChange = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        birthday: '1990-01-01',
        memberSince: '2020',
        agreeToTerms: true,
        addressChange: true,
        newAddress: ''
      };
      
      const { isValid, errors } = validateMembershipRenewal(renewalWithAddressChange);
      expect(isValid).toBe(false);
      expect(errors.newAddress).toBeDefined();
    });
  });
  
  // Foundation Class Registration Validation Tests
  describe('validateFoundationClassRegistration', () => {
    test('should validate a valid foundation class registration', () => {
      const validRegistration = {
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '9876543210',
        preferredSession: 'Sunday Morning',
        status: 'registered'
      };
      
      const { isValid, errors } = validateFoundationClassRegistration(validRegistration);
      expect(isValid).toBe(true);
      expect(errors).toEqual({});
    });
    
    test('should fail validation for an invalid foundation class registration', () => {
      const invalidRegistration = {
        fullName: '',
        email: 'not-an-email',
        phone: '123',
        status: 'invalid-status'
      };
      
      const { isValid, errors } = validateFoundationClassRegistration(invalidRegistration);
      expect(isValid).toBe(false);
      expect(Object.keys(errors).length).toBeGreaterThan(0);
      expect(errors.fullName).toBeDefined();
      expect(errors.email).toBeDefined();
      expect(errors.preferredSession).toBeDefined();
    });
  });
  
  // Status Change Validation Tests
  describe('validateMembershipStatusChange', () => {
    test('should validate valid membership status values', () => {
      const validStatuses = ['pending', 'approved', 'declined'];
      
      validStatuses.forEach(status => {
        const { isValid, error } = validateMembershipStatusChange(status);
        expect(isValid).toBe(true);
        expect(error).toBeNull();
      });
    });
    
    test('should fail validation for invalid membership status values', () => {
      const invalidStatuses = ['', null, undefined, 'invalid-status'];
      
      invalidStatuses.forEach(status => {
        const { isValid, error } = validateMembershipStatusChange(status);
        expect(isValid).toBe(false);
        expect(error).toBeDefined();
      });
    });
  });
  
  describe('validateFoundationClassStatusChange', () => {
    test('should validate valid foundation class status values', () => {
      const validStatuses = ['registered', 'attending', 'completed', 'cancelled'];
      
      validStatuses.forEach(status => {
        const { isValid, error } = validateFoundationClassStatusChange(status);
        expect(isValid).toBe(true);
        expect(error).toBeNull();
      });
    });
    
    test('should fail validation for invalid foundation class status values', () => {
      const invalidStatuses = ['', null, undefined, 'invalid-status'];
      
      invalidStatuses.forEach(status => {
        const { isValid, error } = validateFoundationClassStatusChange(status);
        expect(isValid).toBe(false);
        expect(error).toBeDefined();
      });
    });
  });
});
