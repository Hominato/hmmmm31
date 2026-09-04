/**
 * Alta Federal Credit Union - Profile Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  AuthModule.checkAuthentication();

  if (document.getElementById('profile-form')) {
    renderProfileForm();
  }
});

function renderProfileForm() {
  const user = DemoStorage.getUser();

  const nameInput = document.getElementById('profile-name');
  const emailInput = document.getElementById('profile-email');
  const phoneInput = document.getElementById('profile-phone');
  const addressInput = document.getElementById('profile-address');
  const form = document.getElementById('profile-form');

  if (nameInput) nameInput.value = user.name;
  if (emailInput) emailInput.value = user.email;
  if (phoneInput) phoneInput.value = user.phone;
  if (addressInput) addressInput.value = user.address;

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    DemoStorage.updateUser({
      name: nameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      address: addressInput.value
    });

    UIModule.showToast('✓ Profile information updated successfully', 'success');
  });
}
