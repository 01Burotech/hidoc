async function run() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('Seeding database...');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
