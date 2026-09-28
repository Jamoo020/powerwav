import "server-only";

import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";

const sessionCookieName = "powerwave_admin_session";
const sessionLifetimeSeconds = 60 * 60 * 24 * 7;

type AdminUserRow = {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
};

type AdminSessionInsertRow = {
  id: string;
  expires_at: Date;
  created_at: Date;
};

type AdminSessionLookupRow = AdminSessionInsertRow & {
  user_id: string;
  email: string;
  password_hash: string;
  user_created_at: Date;
  user_updated_at: Date;
};

export type AdminUser = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminSession = {
  id: string;
  user: AdminUser;
  expiresAt: Date;
  createdAt: Date;
};

function mapAdminUser(row: AdminUserRow): AdminUser {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function authError(): Error {
  return new Error("Authentication operation failed.");
}

export async function hashPassword(password: string): Promise<string> {
  if (typeof password !== "string" || password.length === 0) {
    throw new Error("Password is required.");
  }

  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  if (typeof password !== "string" || typeof passwordHash !== "string") {
    return false;
  }

  return bcrypt.compare(password, passwordHash);
}

export async function getAdminUserByEmail(email: string): Promise<AdminUser | null> {
  if (typeof email !== "string" || email.trim() === "") {
    return null;
  }

  try {
    const result = await pool.query<AdminUserRow>(
      `SELECT id, email, password_hash, created_at, updated_at
       FROM admin_users
       WHERE lower(email) = lower($1)
       LIMIT 1`,
      [email.trim()],
    );

    return result.rows[0] ? mapAdminUser(result.rows[0]) : null;
  } catch {
    throw authError();
  }
}

export async function createSession(userId: string): Promise<AdminSession> {
  if (typeof userId !== "string" || userId.trim() === "") {
    throw new Error("User id is required.");
  }

  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + sessionLifetimeSeconds * 1000);

  try {
    const result = await pool.query<AdminSessionInsertRow>(
      `INSERT INTO admin_sessions (id, user_id, expires_at)
       SELECT $1, id, $2
       FROM admin_users
       WHERE id = $3
       RETURNING id, user_id, expires_at, created_at`,
      [sessionId, expiresAt, userId],
    );

    if (result.rowCount !== 1) {
      throw new Error("User not found.");
    }

    const user = await getAdminUserById(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    const cookieStore = await cookies();
    cookieStore.set(sessionCookieName, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      path: "/",
    });

    return {
      id: result.rows[0].id,
      user,
      expiresAt: result.rows[0].expires_at,
      createdAt: result.rows[0].created_at,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "User not found.") {
      throw error;
    }

    throw authError();
  }
}

async function getAdminUserById(id: string): Promise<AdminUser | null> {
  try {
    const result = await pool.query<AdminUserRow>(
      `SELECT id, email, password_hash, created_at, updated_at
       FROM admin_users
       WHERE id = $1
       LIMIT 1`,
      [id],
    );

    return result.rows[0] ? mapAdminUser(result.rows[0]) : null;
  } catch {
    throw authError();
  }
}

export async function getCurrentSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(sessionCookieName)?.value;

  if (!sessionId) {
    return null;
  }

  try {
    const result = await pool.query<AdminSessionLookupRow>(
      `SELECT s.id, s.expires_at, s.created_at,
              u.id AS user_id, u.email, u.password_hash,
              u.created_at AS user_created_at, u.updated_at AS user_updated_at
       FROM admin_sessions s
       JOIN admin_users u ON u.id = s.user_id
       WHERE s.id = $1
         AND s.expires_at > NOW()
       LIMIT 1`,
      [sessionId],
    );

    const row = result.rows[0];
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      user: {
        id: row.user_id,
        email: row.email,
        passwordHash: row.password_hash,
        createdAt: row.user_created_at,
        updatedAt: row.user_updated_at,
      },
      expiresAt: row.expires_at,
      createdAt: row.created_at,
    };
  } catch {
    throw authError();
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(sessionCookieName)?.value;

  if (sessionId) {
    try {
      await pool.query("DELETE FROM admin_sessions WHERE id = $1", [sessionId]);
    } catch {
      throw authError();
    }
  }

  cookieStore.set(sessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });
}

export const logout = deleteSession;
