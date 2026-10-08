import assert from "node:assert/strict";
import {
  destinationFor,
  hasCompleteProfile,
  isTeacherWaiting,
  readSessionUser,
  resolveAccountRole,
  ROLES,
  STATUSES,
} from "./roles.js";

const owner = "owner@ilmdesk.com";

assert.deepEqual(
  resolveAccountRole({ email: "new@school.com", intent: ROLES.student, ownerEmail: owner }),
  { role: ROLES.student, status: STATUSES.active }
);

assert.deepEqual(
  resolveAccountRole({ email: "new@school.com", intent: ROLES.teacher, ownerEmail: owner }),
  { role: ROLES.teacher, status: STATUSES.pending }
);

assert.deepEqual(
  resolveAccountRole({
    email: "Owner@ilmdesk.com",
    intent: ROLES.teacher,
    ownerEmail: owner,
  }),
  { role: ROLES.owner, status: STATUSES.active }
);

assert.deepEqual(
  resolveAccountRole({
    email: "student@school.com",
    intent: ROLES.teacher,
    existing: { role: ROLES.student, status: STATUSES.active },
    ownerEmail: owner,
  }),
  { role: ROLES.student, status: STATUSES.active }
);

assert.deepEqual(
  resolveAccountRole({
    email: owner,
    existing: { role: ROLES.student, status: STATUSES.active },
    ownerEmail: owner,
  }),
  { role: ROLES.owner, status: STATUSES.active }
);

const pendingTeacher = {
  uid: "t1",
  role: ROLES.teacher,
  status: STATUSES.pending,
  profileComplete: true,
};
assert.equal(isTeacherWaiting(pendingTeacher), true);
assert.equal(hasCompleteProfile(pendingTeacher), true);
assert.equal(destinationFor(pendingTeacher, { redirectTo: "/dashboard" }), "/dashboard");
assert.equal(
  destinationFor(
    { uid: "s1", role: ROLES.student, status: STATUSES.active, profileComplete: true },
    { redirectTo: "/courses/checkout", courseId: "c1" }
  ),
  "/courses/checkout?id=c1"
);
assert.equal(
  destinationFor(
    { uid: "s1", role: ROLES.student, status: STATUSES.active },
    { redirectTo: "/courses/checkout", courseId: "c1" }
  ),
  "/account/profile?redirect=%2Fcourses%2Fcheckout&id=c1"
);

const raw = JSON.stringify({
  user: { uid: "s1", name: "Ada", email: "ada@school.com" },
});
assert.equal(readSessionUser(raw).role, ROLES.student);
assert.equal(readSessionUser(raw).status, STATUSES.active);
assert.equal(readSessionUser(raw).profileComplete, false);
assert.equal(readSessionUser("not-json"), null);

assert.deepEqual(
  resolveAccountRole({
    email: "friend@school.com",
    uid: "friendUid123",
    intent: ROLES.teacher,
    existing: { role: ROLES.teacher, status: STATUSES.pending },
    ownerEmail: owner,
    brandAdminId: "friendUid123",
  }),
  { role: ROLES.owner, status: STATUSES.active }
);

assert.deepEqual(
  resolveAccountRole({
    email: "friend@school.com",
    uid: "otherUid123",
    existing: { role: ROLES.teacher, status: STATUSES.pending },
    ownerEmail: owner,
    brandAdminId: "friendUid123",
  }),
  { role: ROLES.teacher, status: STATUSES.pending }
);

console.log("roles ok");
