describe('Manacity app smoke test', () => {
  it('launches', async () => {
    await device.launchApp({ newInstance: true });
    await expect(element(by.id('app-root'))).toBeVisible();
  });
});
