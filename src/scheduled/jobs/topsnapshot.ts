import prisma from "../../init/database";

async function doTopBalance() {
  const query = await prisma.economy.findMany({
    select: {
      userId: true,
      money: true,
    },
    orderBy: {
      money: "desc",
    },
    take: 25,
  });

  const date = new Date();

  for (const user of query) {
    await prisma.graphMetrics.create({
      data: {
        value: user.money,
        date,
        userId: user.userId,
        category: "balance",
      },
    });
  }
}

async function doTopNetworth() {
  const query = await prisma.economy.findMany({
    select: {
      userId: true,
      netWorth: true,
    },
    orderBy: {
      netWorth: "desc",
    },
    take: 25,
  });

  const date = new Date();

  for (const user of query) {
    await prisma.graphMetrics.create({
      data: {
        userId: user.userId,
        value: user.netWorth,
        date,
        category: "networth",
      },
    });
  }
}

async function doCookies() {
  const query = await prisma.inventory.findMany({
    where: {
      item: "cookie",
    },
    select: {
      userId: true,
      amount: true,
    },
    orderBy: {
      amount: "desc",
    },
    take: 25,
  });

  const date = new Date();

  for (const user of query) {
    await prisma.graphMetrics.create({
      data: {
        userId: user.userId,
        value: user.amount,
        date,
        category: "cookies",
      },
    });
  }
}

async function doMembers() {
  const query = await prisma.premium.findMany({
    select: {
      userId: true,
      user: {
        select: {
          Economy: {
            select: {
              money: true,
              netWorth: true,
            },
          },
        },
      },
    },
  });

  const date = new Date();

  for (const user of query) {
    if (user.user?.Economy?.money) {
      await prisma.graphMetrics.create({
        data: {
          category: "user-money",
          date,
          userId: user.userId,
          value: user.user.Economy.money,
        },
      });
    }
    if (user.user?.Economy?.netWorth) {
      await prisma.graphMetrics.create({
        data: {
          category: "user-net",
          date,
          userId: user.userId,
          value: user.user.Economy.netWorth,
        },
      });
    }
  }
}

(async () => {
  await Promise.all([doTopBalance(), doTopNetworth(), doCookies(), doMembers()]);

  process.exit(0);
})();