import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";

const router = Router();

function hashPassword(pw: string): string {
  return createHash("sha256").update(pw + process.env.SESSION_SECRET).digest("hex");
}

router.post("/v1/auth/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    const [existing] = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing) return res.status(409).json({ error: "Email already registered" });
    const [user] = await db.insert(usersTable).values({
      email, name, passwordHash: hashPassword(password), role: "user",
    }).returning({ id: usersTable.id, email: usersTable.email, name: usersTable.name, role: usersTable.role });
    res.status(201).json({ user, token: Buffer.from(`${user.id}:${user.email}`).toString("base64") });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/v1/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token: Buffer.from(`${user.id}:${user.email}`).toString("base64") });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/auth/me", async (req, res) => {
  try {
    const auth = req.headers.authorization?.replace("Bearer ", "");
    if (!auth) return res.status(401).json({ error: "Unauthorized" });
    const decoded = Buffer.from(auth, "base64").toString();
    const [idStr, email] = decoded.split(":");
    if (!idStr || !email) return res.status(401).json({ error: "Invalid token" });
    const [user] = await db.select({ id: usersTable.id, email: usersTable.email, name: usersTable.name, role: usersTable.role })
      .from(usersTable).where(eq(usersTable.id, parseInt(idStr))).limit(1);
    if (!user) return res.status(401).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
