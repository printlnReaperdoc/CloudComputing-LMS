-- ============================================================================
-- LMS Database Seed Data: cloudcomputinglms
-- Contains Course Metadata, 12 Chapters, 240 Quiz Questions, and Pre-configured Users
-- ============================================================================

USE `cloudcomputinglms`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Course Metadata
INSERT INTO `courses` (`course_id`, `code`, `title`, `term`, `year_level`, `description`)
VALUES (1, 'ITEP413-T', 'Cloud Computing (Elective 4)', '1st Term', '4th Year (4-1)', 'IT Professional Elective 4 course on Cloud Computing covering architectural basics, core technologies, enterprise security, operations, and emerging hyperscale paradigms.')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- 2. Demo Users (Faculty and Students)
INSERT INTO `users` (`user_id`, `username`, `password_hash`, `first_name`, `surname`, `role`, `is_active`)
VALUES (1, 'faculty', '5288a4788d5e97aa290f6c0ce83abba7:01fcd96f3ae8bfc5b0b99b14afa8d33fca82ac953caefcd7498cdf0d8661324db69ee68a85fd041ff5261e8423f3e19a7ca739e387657c69144648b971c21dcb', 'Alan', 'Turing', 'faculty', 1)
ON DUPLICATE KEY UPDATE `role`=VALUES(`role`);
INSERT INTO `users` (`user_id`, `username`, `password_hash`, `first_name`, `surname`, `role`, `is_active`)
VALUES (2, 'student1', '040cc0809fe7d07d6b8662063e69a68d:8d489c969b8e5d211509afd7823746b785e61215a46212a77beca868a768a2cd4524f4f5d1144a2e9cb5af37b4f8d0521024e542e157163d6bccd76a4c976a25', 'Juan', 'Dela Cruz', 'student', 1)
ON DUPLICATE KEY UPDATE `role`=VALUES(`role`);
INSERT INTO `users` (`user_id`, `username`, `password_hash`, `first_name`, `surname`, `role`, `is_active`)
VALUES (3, 'student2', 'b1975e2299f6a16d3763420c668dc934:13cec8df669e8b9bf511f29bd70237d5b946012b4c564096a333e5ced86ba47ba6f9c3d5339de69e9e31735075f3883c70065c489679b9e61514e07c3261007d', 'Maria', 'Santos', 'student', 1)
ON DUPLICATE KEY UPDATE `role`=VALUES(`role`);
INSERT INTO `users` (`user_id`, `username`, `password_hash`, `first_name`, `surname`, `role`, `is_active`)
VALUES (4, 'student3', 'b0ce663033a544ad849f8e2899999633:7044b3864dabf2fb55d9f021339b58423bcd4b94dee20cfed6c8be3d7dbcb07dbca1f9ec99f9057af5d4288106fdc53af0c1355936ab01b5c89e65af34a575a0', 'Carlo', 'Reyes', 'student', 1)
ON DUPLICATE KEY UPDATE `role`=VALUES(`role`);
INSERT INTO `users` (`user_id`, `username`, `password_hash`, `first_name`, `surname`, `role`, `is_active`)
VALUES (5, 'student4', '71af2f1d96772a3476538a9c32ca1658:89e35345a75cbe4ad571d15ad3ea3e4a10982d2da19b235daa1cd3c8c848f16608af2c7a5fa8d32b00f58646e9047db18cdb76fcf28e6d45bb6e1137516ae515', 'Ana', 'Gomez', 'student', 1)
ON DUPLICATE KEY UPDATE `role`=VALUES(`role`);

-- 3. Chapters, Quizzes, and Question Banks
-- Chapter 1: Introduction to Cloud Computing
INSERT INTO `chapters` (`chapter_id`, `course_id`, `chapter_number`, `module_title`, `chapter_title`, `summary_text`)
VALUES (1, 1, 1, 'Module 1: Basics and Architecture', 'Introduction to Cloud Computing', '### Overview & Core Tenets
Cloud computing represents a fundamental shift in how digital infrastructure, software, and platforms are provisioned, consumed, and monetized. Formally defined by the **National Institute of Standards and Technology (NIST SP 800-145)**:
> *"Cloud computing is a model for enabling ubiquitous, convenient, on-demand network access to a shared pool of configurable computing resources (e.g., networks, servers, storage, applications, and services) that can be rapidly provisioned and released with minimal management effort or service provider interaction."*

### The Five NIST Essential Characteristics
1. **On-Demand Self-Service:** Consumers can provision computing capabilities automatically without requiring human interaction with each service provider.
2. **Broad Network Access:** Capabilities are available over the network and accessed through standard mechanisms promoting heterogeneous thin or thick client platforms.
3. **Resource Pooling:** The provider''s computing resources are pooled to serve multiple consumers using a multi-tenant model, with different physical and virtual resources dynamically assigned.
4. **Rapid Elasticity:** Resources can be elastically provisioned and released, in some cases automatically, to scale rapidly outward and inward commensurate with demand.
5. **Measured Service:** Cloud systems automatically control and optimize resource use by leveraging a metering capability at some level of abstraction appropriate to the type of service.

### Historical Evolution & Financial Impact
- **Mainframe Era (1950s-1970s):** Centralized processing via dumb terminals using time-sharing OS (e.g., IBM VM/370).
- **Client-Server & Distributed Grid (1980s-1990s):** Distributed personal computers communicating with centralized database/file servers.
- **Utility Computing & Modern Cloud (2000s-Present):** Initiated with Amazon Web Services (AWS EC2/S3 in 2006), enabling computing as an on-demand utility like electricity.
- **CapEx vs OpEx:** On-premise infrastructure requires heavy upfront Capital Expenditures (servers, HVAC, real estate, depreciating assets). Cloud flips this into Operational Expenditures (pay-as-you-go, scalable operational cost tied directly to business throughput).')
ON DUPLICATE KEY UPDATE `chapter_title`=VALUES(`chapter_title`);

INSERT INTO `quizzes` (`quiz_id`, `chapter_id`, `title`, `time_limit_minutes`, `passing_percentage`, `total_questions`)
VALUES (1, 1, 'Chapter 1 Assessment: Introduction to Cloud Computing', 10, 75, 20)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (1, 1, 'According to NIST SP 800-145, which of the following is NOT one of the 5 essential characteristics of cloud computing?', 'On-demand self-service', 'Resource pooling', 'Guaranteed 100% uninterrupted uptime', 'Measured service', 'C');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (2, 1, 'What does the NIST characteristic ''Rapid Elasticity'' primarily mean?', 'The ability to run on multiple types of computer monitors', 'Capabilities can be elastically provisioned and released to scale rapidly outward and inward with demand', 'The speed at which physical optical cables transmit laser pulses', 'The ability of developers to work flexible remote work schedules', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (3, 1, 'Which financial model change is most commonly associated with moving from on-premise data centers to the public cloud?', 'CapEx to OpEx', 'OpEx to CapEx', 'Fixed cost to zero cost', 'Elimination of all software licensing', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (4, 1, 'Which organization authored the widely accepted standard definition for Cloud Computing in Special Publication 800-145?', 'IEEE', 'ISO', 'NIST (National Institute of Standards and Technology)', 'W3C', 'C');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (5, 1, 'In NIST terminology, what does ''Multi-Tenancy'' through resource pooling mean?', 'Multiple organizations renting office space in the same physical corporate building', 'Serving multiple customers from the same physical infrastructure with virtual isolation', 'A single computer running only one operating system with no network connection', 'Renting server racks exclusively for one tenant without virtualization', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (6, 1, 'What landmark event in 2006 marked the beginning of modern public Infrastructure as a Service (IaaS)?', 'The founding of Microsoft Corporation', 'The launch of Amazon Web Services (AWS) offering S3 and EC2', 'The invention of the World Wide Web by Tim Berners-Lee', 'The introduction of the Linux kernel version 1.0', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (7, 1, 'Which of the following best defines ''Measured Service''?', 'Measuring the physical square footage of the cloud provider''s datacenter', 'Monitoring and controlling resource usage with transparent metering and billing based on actual consumption', 'Measuring the length of fiber optic cables connecting servers', 'Counting the number of physical engineers employed on-site', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (8, 1, 'What is the primary difference between traditional hosting and true cloud computing?', 'Cloud computing always runs on Windows operating systems', 'Cloud computing provides automated self-service, elasticity, and dynamic resource pooling', 'Traditional hosting is always free whereas cloud is expensive', 'Traditional hosting uses virtualization whereas cloud does not', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (9, 1, 'Which pioneer famously predicted in 1961 that ''computation may someday be organized as a public utility''?', 'Steve Jobs', 'John McCarthy', 'Bill Gates', 'Linus Torvalds', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (10, 1, 'What is a major financial risk if an organization does not govern its cloud resource consumption?', 'Depreciation of virtual machines', 'Uncontrolled bill shock due to runaway idle or over-provisioned cloud instances', 'Physical wear and tear on developer laptops', 'Mandatory corporate tax audits on every API call', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (11, 1, 'What does ''Broad Network Access'' guarantee in the cloud model?', 'Every citizen receives free internet connectivity', 'Cloud services can be accessed using standard protocols across diverse client platforms (phones, tablets, laptops, workstations)', 'All network traffic must travel via undersea satellite links', 'The cloud datacenter must be located within 5 kilometers of the user', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (12, 1, 'Which term describes the practice of managing and optimizing cloud operational expenditures?', 'DevSecOps', 'FinOps', 'SysAdmin', 'NetOps', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (13, 1, 'Under an on-premise model, what is a typical hardware procurement lead time for new physical servers?', 'Instantaneous (less than 1 millisecond)', 'Weeks to months (purchase orders, shipping, racking, cabling)', 'Always exactly 24 hours', 'Zero days because servers grow automatically', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (14, 1, 'Which of the following is an example of an on-demand self-service action?', 'Submitting a paper requisition form to an IT committee and waiting 3 weeks', 'Deploying an Amazon EC2 virtual machine using a CLI command or management console without human approval', 'Physically driving to a datacenter to insert a RAM stick', 'Calling a phone hotline to request a reboot', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (15, 1, 'Why does cloud resource pooling lead to economies of scale?', 'Providers purchase hardware in massive bulk and achieve higher average server utilization across diverse customer time zones', 'Providers don''t pay for electricity', 'Cloud servers do not require processors or memory chips', 'Providers use unpaid volunteer software engineers', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (16, 1, 'What is ''over-provisioning'' in traditional computing environments?', 'Buying excess physical hardware to survive rare peak usage spikes, leaving resources idle 90% of the time', 'Running out of RAM during normal operations', 'Writing code with too many nested loops', 'Hiring too many technical writers for software manuals', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (17, 1, 'How does cloud computing address the problem of over-provisioning and under-provisioning?', 'By enforcing a fixed limit of 100 users per company', 'By utilizing dynamic auto-scaling to match resource allocation directly with instantaneous demand', 'By shutting down user applications whenever traffic increases', 'By converting all user traffic into email messages', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (18, 1, 'Which company pioneered software delivery over the web via SaaS in 1999?', 'Salesforce', 'Netflix', 'Uber', 'Spotify', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (19, 1, 'What does ''Sunk Cost'' mean in the context of on-premise datacenter equipment?', 'Hardware submerged in liquid cooling tanks', 'Money already spent that cannot be recovered regardless of future decisions', 'The cost of undersea fiber optic communication cables', 'The electricity consumed during a network power outage', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (20, 1, 'Which of the following is considered an Operational Expenditure (OpEx)?', 'Monthly AWS billing invoice for compute and storage consumed', 'Buying a 50,000 square foot plot of land to build a datacenter', 'Purchasing a $250,000 diesel backup generator for a server room', 'Purchasing a 5-year permanent server rack chassis', 'A');

-- Chapter 2: Cloud Architecture and Core Concepts
INSERT INTO `chapters` (`chapter_id`, `course_id`, `chapter_number`, `module_title`, `chapter_title`, `summary_text`)
VALUES (2, 1, 2, 'Module 1: Basics and Architecture', 'Cloud Architecture and Core Concepts', '### Cloud Architecture Overview
Cloud Architecture encompasses the structural design of software systems deployed in the cloud, dissecting the system into two distinct operational planes:
1. **Front-End Platform:** The client side comprising web browsers, native mobile apps, API clients, and network edge gateways that interact directly with the user.
2. **Back-End Platform:** The cloud provider environment comprising compute servers, hypervisors, storage clusters, database engines, management services, security protocols, and network fabrics.

### Scalability vs. Elasticity
- **Vertical Scalability (Scale Up):** Adding more power (CPU, RAM, NVMe storage) to an existing single instance. Bound by physical hardware limits and requires downtime during hardware reconfiguration.
- **Horizontal Scalability (Scale Out):** Adding more instances/nodes in parallel behind a load balancer. Virtually limitless, enables zero-downtime rolling upgrades, and supports distributed fault tolerance.

### Resilience and Disaster Recovery Metrics
- **High Availability (HA):** Architectural design ensuring a system remains operational and accessible without interruption across a defined SLA (e.g., 99.99% or "four nines", translating to under 52.6 minutes of downtime per year).
- **Fault Domain:** A set of hardware components (servers, switches, power supplies) that share a single point of failure. Deploying across multiple Availability Zones isolates fault domains.
- **RPO (Recovery Point Objective):** The maximum acceptable data loss measured in time (e.g., how much data can the business afford to lose from the point of failure).
- **RTO (Recovery Time Objective):** The maximum acceptable duration of system downtime before service must be fully restored.')
ON DUPLICATE KEY UPDATE `chapter_title`=VALUES(`chapter_title`);

INSERT INTO `quizzes` (`quiz_id`, `chapter_id`, `title`, `time_limit_minutes`, `passing_percentage`, `total_questions`)
VALUES (2, 2, 'Chapter 2 Assessment: Cloud Architecture and Core Concepts', 10, 75, 20)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (21, 2, 'What does Horizontal Scaling (Scale Out) involve in cloud architecture?', 'Adding more CPUs and RAM to a single existing virtual machine', 'Adding more machine instances in parallel to distribute the workload', 'Increasing the physical height of a server rack', 'Migrating from Linux to Windows operating systems', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (22, 2, 'What is Vertical Scaling (Scale Up)?', 'Upgrading the hardware specs (CPU, RAM, disk) of a single server', 'Adding 10 additional micro instances to an Auto Scaling Group', 'Moving a server from the first floor to the top floor of a building', 'Setting up a content delivery network', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (23, 2, 'What is a Single Point of Failure (SPOF)?', 'A software testing methodology used by QA teams', 'Any single component whose malfunction terminates the entire system''s operation', 'A backup generator running in a datacenter', 'A high-speed optical network switch with redundant links', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (24, 2, 'What does ''Recovery Point Objective'' (RPO) measure?', 'The length of time required to boot up a new server', 'The maximum acceptable amount of data loss expressed in time prior to the disaster', 'The financial cost of purchasing replacement hard drives', 'The number of employees permitted in a server room', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (25, 2, 'What does ''Recovery Time Objective'' (RTO) measure?', 'The maximum allowable downtime before a business process or application must be restored', 'The time it takes to write a line of code', 'The speed at which data travels through optical fiber', 'The warranty duration of physical cloud servers', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (26, 2, 'How much annual downtime is permitted under a ''four nines'' (99.99%) High Availability SLA?', 'Approximately 3.65 days', 'Approximately 8.76 hours', 'Approximately 52.6 minutes', 'Zero seconds under all circumstances', 'C');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (27, 2, 'In public cloud platforms like AWS, what is an Availability Zone (AZ)?', 'A country where cloud sales reps are physically present', 'One or more discrete datacenters with independent power, cooling, and networking within a region', 'A software licensing zone with reduced tax rates', 'The range of IP addresses assigned to student accounts', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (28, 2, 'What is the primary advantage of deploying an application across Multi-AZ (Multiple Availability Zones)?', 'It eliminates all software coding bugs', 'It ensures the system survives if a disaster strikes a single physical datacenter', 'It makes the cloud subscription 100% free of charge', 'It stops malicious hackers from viewing public websites', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (29, 2, 'Which Disaster Recovery strategy features the lowest RTO and RPO but carries the highest operational cost?', 'Backup and Restore', 'Pilot Light', 'Warm Standby', 'Multi-Site Active-Active', 'D');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (30, 2, 'What role does a Load Balancer play in a horizontally scalable cloud system?', 'It distributes incoming client traffic evenly across multiple healthy backend application instances', 'It regulates electrical voltage entering server motherboards', 'It deletes unused files on student hard drives', 'It encrypts physical hard drives using biometric locks', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (31, 2, 'What is a ''Fault Domain'' in cloud infrastructure design?', 'A section of an application codebase with failing unit tests', 'A physical grouping of infrastructure hardware that shares common single points of failure like power and network switches', 'A domain name that has expired and cannot be registered', 'An invalid user account blocked by an administrator', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (32, 2, 'In the context of Disaster Recovery, what does a ''Pilot Light'' approach mean?', 'Turning off all lights inside the physical datacenter to conserve energy', 'Replicating critical core data in real-time, while keeping compute infrastructure stopped until disaster recovery is triggered', 'Running only a small pilot group of test users on beta software', 'Using solar powered battery backups for server fans', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (33, 2, 'Which architectural characteristic is essential for web applications to scale horizontally without session conflicts?', 'Stateful local memory storage on the server hard drive', 'Stateless architecture with centralized session stores (e.g. Redis or database)', 'Hard-coding user IP addresses into application source code', 'Enforcing single-threaded execution on all backend workers', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (34, 2, 'What happens when a vertically scaled server reaches the physical motherboards maximum RAM capacity?', 'The server creates virtual quantum RAM automatically', 'It hits a hardware ceiling and cannot scale up any further without complete architecture redesign', 'The operating system converts CPU cache into hard disk space', 'The cloud provider provides free server hardware upgrades', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (35, 2, 'What is the primary role of the Frontend plane in cloud architecture?', 'Directly managing SAN disk arrays inside datacenters', 'Interfacing with the client through UI, mobile apps, DNS, and API gateways', 'Configuring kernel hypervisor schedulers', 'Executing database backup restore scripts', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (36, 2, 'Which of the following is an example of an architectural Single Point of Failure (SPOF)?', 'A database cluster with automated multi-region active replication', 'A web tier utilizing three redundant servers across two Availability Zones', 'A single centralized database server with no standby replicas or automated backups', 'A DNS service configured with multiple global anycast IP addresses', 'C');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (37, 2, 'If an enterprise requires an RPO of 5 minutes, what does this dictate for their data backup strategy?', 'They can back up their database once a month', 'They must continuously replicate or snapshot data at least every 5 minutes', 'They only need paper printouts of financial records', 'They can accept losing up to 48 hours of customer data', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (38, 2, 'What is the difference between a Cloud Region and an Edge Location / Point of Presence (PoP)?', 'Regions host full compute, database, and storage platforms; Edge Locations cache content close to end users for lower latency', 'Regions are for students; Edge Locations are for faculty', 'Edge locations contain nuclear power plants', 'Regions only exist in North America', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (39, 2, 'Why do distributed cloud microservices utilize message queues (e.g., SQS, RabbitMQ, Kafka)?', 'To slow down user requests so servers do not overheat', 'To decouple microservices asynchronously and absorb sudden traffic spikes without dropped requests', 'To replace all relational databases permanently', 'To restrict internet access to authorized corporate IP addresses', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (40, 2, 'What is the mathematical availability percentage for ''five nines''?', '95.555%', '99.005%', '99.999%', '99.990%', 'C');

-- Chapter 3: Cloud Service Models (IaaS, PaaS, SaaS)
INSERT INTO `chapters` (`chapter_id`, `course_id`, `chapter_number`, `module_title`, `chapter_title`, `summary_text`)
VALUES (3, 1, 3, 'Module 1: Basics and Architecture', 'Cloud Service Models (IaaS, PaaS, SaaS)', '### The Cloud Service Model Spectrum
The NIST framework establishes three fundamental service delivery models representing escalating tiers of vendor abstraction:
1. **Infrastructure as a Service (IaaS):** The provider provisions fundamental compute, networking, storage, and virtualization. The customer retains control over operating systems, middleware, runtime environments, storage volumes, and deployed applications (e.g., AWS EC2, Google Compute Engine, Azure VMs).
2. **Platform as a Service (PaaS):** The provider manages underlying hardware, networking, OS patching, runtime execution environments, and databases. The customer only manages the application source code and application-specific configurations (e.g., Heroku, AWS Elastic Beanstalk, Google App Engine).
3. **Software as a Service (SaaS):** The provider manages the complete technology stack from hardware up through the end-user application interface. The customer consumes the software via web browser or API without managing underlying infrastructure (e.g., Microsoft 365, Google Workspace, Salesforce, Zoom).

### The Shared Responsibility Model
Security and compliance in cloud computing are shared between the Cloud Service Provider (CSP) and the customer:
- **In IaaS:** The CSP secures the physical datacenter, host hypervisor, and physical networks. The customer is responsible for guest OS patching, firewall rules, user identity, data encryption, and application vulnerabilities.
- **In PaaS:** The CSP also manages OS security patches, runtime updates, and network firewalls. The customer is responsible for application logic, access controls, and customer data.
- **In SaaS:** The CSP manages virtually the entire stack. The customer is responsible for access governance (passwords, MFA), user permissions, and data loss prevention.')
ON DUPLICATE KEY UPDATE `chapter_title`=VALUES(`chapter_title`);

INSERT INTO `quizzes` (`quiz_id`, `chapter_id`, `title`, `time_limit_minutes`, `passing_percentage`, `total_questions`)
VALUES (3, 3, 'Chapter 3 Assessment: Cloud Service Models (IaaS, PaaS, SaaS)', 10, 75, 20)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (41, 3, 'Which cloud service model provides the customer with the highest degree of administrative control over the operating system and networking?', 'Software as a Service (SaaS)', 'Platform as a Service (PaaS)', 'Infrastructure as a Service (IaaS)', 'Function as a Service (FaaS)', 'C');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (42, 3, 'Which of the following is the best example of a Software as a Service (SaaS) application?', 'Amazon EC2', 'Google Workspace (formerly G Suite)', 'Google App Engine', 'OpenStack', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (43, 3, 'Under the Shared Responsibility Model for an IaaS deployment (e.g. AWS EC2), who is responsible for patching the guest operating system?', 'The Cloud Service Provider (e.g. AWS)', 'The customer / organization deploying the virtual machine', 'The hardware manufacturer of the server', 'The local electrical utility company', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (44, 3, 'What does the cloud provider manage in a Platform as a Service (PaaS) offering?', 'Only the physical security of the datacenter doors', 'The hardware, virtualization, operating system, runtime environment, and middleware', 'The customer''s business bank accounts', 'Nothing; the customer manages all software layers', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (45, 3, 'Which of the following services is classified as Platform as a Service (PaaS)?', 'AWS Elastic Beanstalk', 'Amazon S3', 'Microsoft Office 365', 'Physical bare-metal server', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (46, 3, 'What is the primary defining billing characteristic of Serverless Function as a Service (FaaS)?', 'Paying a flat fee of $1,000 every calendar month', 'Billed strictly for the exact compute execution duration (milliseconds) while code runs, with $0 cost when idle', 'Billed per physical processor chip inside the datacenter', 'Billed only if your code has zero bugs', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (47, 3, 'In the ''Pizza as a Service'' analogy, which cloud model corresponds to ''Dining at a Restaurant'' where everything is provided for you?', 'On-Premises', 'IaaS', 'PaaS', 'SaaS', 'D');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (48, 3, 'What security duty remains the responsibility of the customer across ALL cloud models (IaaS, PaaS, and SaaS)?', 'Physical security guard patrols around the server cages', 'User authentication, identity access management, and data governance', 'Replacing faulty hard drives in storage arrays', 'Updating BIOS firmware on server motherboards', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (49, 3, 'Why might a legacy enterprise application NOT be suitable for PaaS without significant code refactoring?', 'PaaS environments do not support the English language', 'The application may rely on specific underlying OS kernel drivers, registry hacks, or local file system state that PaaS restricts', 'PaaS is illegal for commercial organizations', 'PaaS does not support networking or internet protocols', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (50, 3, 'Which service model offers the highest developer velocity for building new web and mobile backends quickly?', 'IaaS', 'PaaS', 'Bare-metal on-premise servers', 'Mainframe punch cards', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (51, 3, 'What is an architectural concern known as ''Cold Start'' in Serverless FaaS platforms?', 'Servers physically freezing in arctic datacenters', 'Initial latency delay when a function container is initialized from an idle state upon receiving a request', 'The time required to compile C++ code', 'A server failing to boot because of battery discharge', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (52, 3, 'Which of the following is an example of an Infrastructure as a Service (IaaS) provider offering?', 'Salesforce CRM', 'Microsoft Azure Virtual Machines', 'Canva Graphic Design', 'Dropbox Web App', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (53, 3, 'Who is responsible for physical datacenter security in a public cloud model?', 'The Cloud Service Provider (CSP)', 'The customer''s local security team', 'The end users accessing the website', 'The United Nations IT council', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (54, 3, 'What is a potential disadvantage of utilizing Platform as a Service (PaaS)?', 'Having to buy physical server racks', 'Potential vendor lock-in due to platform-specific configuration APIs and runtime constraints', 'Inability to run any JavaScript code', 'Paying for unused idle servers 24 hours a day', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (55, 3, 'If a company uses Salesforce for CRM, what tier of the cloud service stack is it utilizing?', 'Hardware as a Service (HaaS)', 'Software as a Service (SaaS)', 'Infrastructure as a Service (IaaS)', 'Database as a Service (DBaaS)', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (56, 3, 'In IaaS, what tool does the customer use to configure virtual network boundaries and subnets?', 'Virtual Private Cloud (VPC)', 'Physical patch cables', 'Hardware soldering iron', 'SaaS email client', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (57, 3, 'Which service model is best suited if you must run a custom Linux distribution with a patched proprietary kernel?', 'SaaS', 'PaaS', 'IaaS', 'FaaS', 'C');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (58, 3, 'What does the phrase ''Security OF the Cloud'' encompass?', 'Protecting the global infrastructure, hardware, and physical facilities that run cloud services', 'Writing customer web application SQL queries securely', 'Configuring customer database user passwords', 'Creating strong passwords for student email accounts', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (59, 3, 'What does the phrase ''Security IN the Cloud'' encompass?', 'Cleaning dust off server fans in the provider datacenter', 'Customer data, identity management, firewall configuration, OS patching, and network traffic protection', 'Building concrete blast walls around provider buildings', 'Replacing undersea optical fiber repeaters', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (60, 3, 'Why is Software as a Service (SaaS) considered cost-effective for standard office productivity tools?', 'It eliminates in-house server hardware, deployment engineering, and ongoing maintenance overhead', 'It allows employees to work with no internet access forever', 'It grants the company ownership of the cloud provider''s datacenters', 'It replaces all computer monitors with virtual reality headsets', 'A');

-- Chapter 4: Cloud Deployment Models (Public, Private, Hybrid, Community)
INSERT INTO `chapters` (`chapter_id`, `course_id`, `chapter_number`, `module_title`, `chapter_title`, `summary_text`)
VALUES (4, 1, 4, 'Module 1: Basics and Architecture', 'Cloud Deployment Models (Public, Private, Hybrid, Community)', '### Overview of Deployment Models
Cloud deployment models define the ownership, accessibility, physical location, and governance of cloud infrastructure:
1. **Public Cloud:** Infrastructure owned and operated by third-party commercial cloud providers (AWS, Microsoft Azure, Google Cloud). Multi-tenant resources are delivered over the public internet to any organization or individual. Offers the highest elasticity and lowest upfront cost, but poses multi-tenancy and data residency compliance questions.
2. **Private Cloud:** Infrastructure operated exclusively for a single organization. Can be physically located on-premises in a corporate data center or hosted off-site by a third-party managed provider (e.g., OpenStack, VMware vSphere/Cloud Foundation). Offers maximum control, stringent security compliance, and predictable performance, but requires heavy capital expenditure and dedicated IT maintenance.
3. **Hybrid Cloud:** An integrated orchestration combining one or more private clouds with one or more public clouds bound together by standardized or proprietary technology enabling data and application portability (e.g., AWS Outposts, Azure Arc, Google Anthos). Enables "Cloud Bursting"—running steady workloads on-premise and bursting to the public cloud during peak demand.
4. **Community Cloud:** Infrastructure shared by several organizations with shared concerns (e.g., mission, security requirements, regulatory compliance, or research objectives). Examples include US GovCloud (dedicated for federal agencies adhering to FedRAMP/ITAR standards) or healthcare research consortia.

### Hybrid Connectivity & Multi-Cloud
- **IPSec VPN:** Encrypted tunnel over the public internet. Cost-effective, quick to establish, but vulnerable to internet latency and bandwidth jitter.
- **Dedicated Direct Interconnect (AWS Direct Connect / Azure ExpressRoute):** Physical dedicated fiber optic cross-connect bypassing the public internet directly into the CSP backbone. Provides consistent throughput (1Gbps - 100Gbps) and deterministic sub-millisecond latency.
- **Multi-Cloud Architecture:** Deploying services across multiple distinct public cloud providers (e.g., running compute on AWS while running BigQuery data analytics on GCP) to avoid single-vendor lock-in, maximize negotiation leverage, and achieve geo-regulatory sovereignty.')
ON DUPLICATE KEY UPDATE `chapter_title`=VALUES(`chapter_title`);

INSERT INTO `quizzes` (`quiz_id`, `chapter_id`, `title`, `time_limit_minutes`, `passing_percentage`, `total_questions`)
VALUES (4, 4, 'Chapter 4 Assessment: Cloud Deployment Models', 10, 75, 20)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (61, 4, 'Which cloud deployment model provides infrastructure for exclusive use by a single organization?', 'Public Cloud', 'Private Cloud', 'Community Cloud', 'Hybrid Cloud', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (62, 4, 'What defines a Public Cloud deployment model?', 'The cloud datacenter is owned by the government and free to all citizens', 'Infrastructure owned and operated by a third-party commercial provider delivered over the public internet to multiple tenants', 'Any website that does not require a password to access', 'A server running open-source Linux software', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (63, 4, 'What is ''Cloud Bursting'' in a Hybrid Cloud architecture?', 'A server overheating and exploding due to high CPU load', 'Running baseline workloads on a private cloud and automatically bursting into a public cloud during demand spikes', 'Deleting all cloud files when a storage quota is exceeded', 'A hacker attacking multiple cloud providers simultaneously', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (64, 4, 'Which cloud deployment model is designed for organizations with shared mission goals, security requirements, or compliance regulations?', 'Private Cloud', 'Community Cloud', 'Public Cloud', 'Personal Cloud', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (65, 4, 'What is AWS GovCloud an example of?', 'A public social media platform', 'A community/specialized cloud environment meeting US government compliance standards (e.g. FedRAMP, ITAR)', 'A gaming network for government employees', 'A private cloud running inside a presidential office', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (66, 4, 'Which connectivity method provides a dedicated, physical fiber optic link bypassing the public internet to connect on-premises data centers to AWS?', 'Public Wi-Fi Hotspot', 'AWS Direct Connect', 'Standard dial-up modem', 'Bluetooth Low Energy', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (67, 4, 'What is Azure''s equivalent service to AWS Direct Connect?', 'Azure ExpressRoute', 'Azure Virtual Network Gateway', 'Azure QuickLink', 'Azure FiberDirect', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (68, 4, 'What is a primary disadvantage of a Private Cloud compared to a Public Cloud?', 'Lower control over security policies', 'High upfront Capital Expenditures (CapEx) and continuous in-house operational maintenance', 'Total inability to run virtualization software', 'Having to share physical hard drives with external competitors', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (69, 4, 'What is the primary benefit of a Multi-Cloud strategy?', 'It guarantees that the company will never pay any cloud bills', 'Mitigating vendor lock-in, enabling best-of-breed tool selection, and increasing disaster resilience across providers', 'Eliminating the need to write software code', 'Merging all cloud providers into a single corporate monopoly', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (70, 4, 'In a hybrid cloud setup, why might a hospital keep patient electronic medical records (EMR) on-premises while running web appointment scheduling in the public cloud?', 'Because public cloud servers cannot display appointment calendars', 'To satisfy strict HIPAA / data residency compliance regulations for patient data while leveraging public cloud elasticity for web traffic', 'Because on-premise servers are always 100 times faster than cloud servers', 'To avoid paying for hospital electricity', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (71, 4, 'What technology allows containerized applications to run seamlessly across on-premise private clouds, AWS, Azure, and Google Cloud?', 'Microsoft Paint', 'Kubernetes and Docker container standards', 'Analog telephone cables', 'Proprietary database triggers', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (72, 4, 'What is a significant drawback of connecting an on-premises datacenter to a cloud provider via an IPSec VPN over the public internet?', 'Data cannot be encrypted', 'Throughput and latency fluctuate unpredictably based on public internet network congestion', 'IPSec VPNs are prohibited by international law', 'It requires installing physical satellites on user roofs', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (73, 4, 'Which open-source software platform is widely used to deploy and orchestrate Private Cloud infrastructure on-premises?', 'OpenStack', 'WordPress', 'VLC Media Player', 'Adobe Photoshop', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (74, 4, 'What is a ''Noisy Neighbor'' problem in a Public Cloud environment?', 'Loud construction noise outside the user''s home office', 'Another tenant on the same physical host monopolizing shared I/O or network bandwidth, degrading your application''s performance', 'Music played by datacenter maintenance staff', 'A compiler generating excessive warning messages', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (75, 4, 'How do hypervisors and modern public cloud providers prevent the noisy neighbor effect?', 'By banning all users from running databases', 'By implementing strict hardware resource throttling, dedicated tenancy options, and modern offloaded nitro hypervisors', 'By disconnecting servers whenever utilization exceeds 20%', 'By using only single-core processors', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (76, 4, 'Which deployment model is most common for early-stage startups that need to launch applications with minimum initial runway?', 'Private Cloud on leased physical mainframes', 'Public Cloud', 'Community Cloud', 'Building an underground nuclear bunker datacenter', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (77, 4, 'What is the primary operational trade-off of adopting a Multi-Cloud architecture?', 'Increased operational complexity, fragmented monitoring, and cross-cloud networking data egress costs', 'Faster internet speeds for all users worldwide', 'Total immunity from all software bugs', 'Automatic reduction of all developer salaries', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (78, 4, 'What is ''Data Sovereignty''?', 'The legal principle that digital data is subject to the laws and governance of the geographic country in which it is physically stored', 'The right of a database administrator to delete tables without warning', 'A cryptocurrency token traded on public exchanges', 'The encryption key used by an operating system kernel', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (79, 4, 'Which tool allows declarative Infrastructure as Code (IaC) provisioning across AWS, Azure, and Google Cloud using a single configuration syntax?', 'HashiCorp Terraform', 'Microsoft Word', 'Adobe Illustrator', 'Windows Calculator', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (80, 4, 'Why might a sovereign government establish a dedicated Community Cloud rather than using standard public cloud regions?', 'To ensure that all physical hardware, network links, and operations personnel meet strict national security clearance mandates', 'Because commercial public clouds cannot connect to the internet', 'To prevent commercial software from being used by citizens', 'Because community clouds are always run on solar powered calculators', 'A');

-- Chapter 5: Virtualization Fundamentals
INSERT INTO `chapters` (`chapter_id`, `course_id`, `chapter_number`, `module_title`, `chapter_title`, `summary_text`)
VALUES (5, 1, 5, 'Module 2: Core Technologies', 'Virtualization Fundamentals', '### Foundations of Virtualization
Virtualization is the foundational technology enabling cloud computing by decoupling operating systems and applications from physical hardware. The core engine of virtualization is the **Hypervisor** (also known as the **Virtual Machine Monitor or VMM**), which multiplexes physical hardware resources (CPU, RAM, Storage, I/O) among multiple Guest Operating Systems running isolated Virtual Machines (VMs).

### Hypervisor Taxonomies
1. **Type 1 (Bare-Metal / Native):** Runs directly on the host''s physical hardware without an underlying host operating system (e.g., VMware ESXi, KVM, Xen, Microsoft Hyper-V).
   - *Characteristics:* High efficiency, low overhead, enterprise-grade reliability, and direct driver access to hardware. Power all major hyperscale clouds.
2. **Type 2 (Hosted):** Runs as a user-space application on top of an existing host operating system (e.g., Oracle VM VirtualBox, VMware Workstation, Parallels Desktop).
   - *Characteristics:* Simpler installation and desktop testing utility, but incurs substantial overhead due to host OS context switching and double scheduling.

### Virtualization Techniques & Mechanisms
- **Full Virtualization:** The guest OS is completely unaware it is running in a virtual environment; hardware calls are trapped and emulated. Hardware-assisted CPU extensions (Intel VT-x, AMD-V) eliminate earlier binary translation penalties.
- **Paravirtualization:** The guest OS kernel is modified to make explicit hypercalls to the hypervisor using specialized drivers (e.g., Linux `virtio`), bypassing emulation and yielding near-native I/O throughput.
- **Live Migration (e.g. vMotion):** The ability to move an active, running virtual machine from one physical host to another with zero perceptible downtime, copying active RAM memory pages incrementally while the VM continues processing.')
ON DUPLICATE KEY UPDATE `chapter_title`=VALUES(`chapter_title`);

INSERT INTO `quizzes` (`quiz_id`, `chapter_id`, `title`, `time_limit_minutes`, `passing_percentage`, `total_questions`)
VALUES (5, 5, 'Chapter 5 Assessment: Virtualization Fundamentals', 10, 75, 20)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (81, 5, 'What is another standard term for a Hypervisor?', 'Virtual Machine Monitor (VMM)', 'Dynamic Host Configuration Protocol (DHCP)', 'Basic Input Output System (BIOS)', 'Network Interface Card (NIC)', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (82, 5, 'What defines a Type 1 Hypervisor?', 'It runs as an application inside an existing host desktop operating system', 'It runs directly on the bare-metal physical hardware without an underlying host operating system', 'It only works on smartphones and mobile devices', 'It requires mechanical floppy disks to boot', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (83, 5, 'Which of the following is an example of a Type 1 (Bare-Metal) Hypervisor?', 'Oracle VM VirtualBox', 'VMware Workstation', 'VMware ESXi', 'Microsoft Word', 'C');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (84, 5, 'Which of the following is an example of a Type 2 (Hosted) Hypervisor?', 'Oracle VM VirtualBox', 'Linux KVM bare-metal', 'Citrix Hypervisor / XenServer', 'AWS Nitro Card', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (85, 5, 'What hardware extensions did Intel and AMD introduce to accelerate CPU virtualization?', 'DirectX and OpenGL', 'Intel VT-x and AMD-V', 'PCI-Express and USB 3.0', 'RGB LED controllers', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (86, 5, 'In Paravirtualization, how does the guest operating system interact with the hypervisor?', 'It does not know it is virtualized and emulates old hardware devices', 'It is modified with specialized drivers (e.g. virtio) to make direct ''hypercalls'' to the hypervisor', 'It bypasses the hypervisor and takes exclusive physical ownership of the CPU', 'It sends analog audio beeps to the motherboard speaker', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (87, 5, 'What is ''Live Migration'' (such as VMware vMotion or KVM live migration)?', 'Migrating an employee from one office desk to another', 'Moving an active, running virtual machine from one physical server to another with zero perceptible downtime', 'Powering off a server, unplugging the hard drive, and physically carrying it to a new room', 'Translating code from Python to Java', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (88, 5, 'What is ''Server Consolidation''?', 'Combining multiple underutilized physical servers into virtual machines on a single powerful physical host', 'Physically soldering two servers together in a server rack', 'Deleting 50% of an organization''s databases to save space', 'Restricting all employees to using only one email account', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (89, 5, 'What phenomenon is known as ''VM Sprawl''?', 'Virtual machines physically expanding in size inside a datacenter rack', 'The proliferation of unmanaged, forgotten, or abandoned virtual machines consuming cluster computing resources', 'An error where a virtual machine fails to allocate an IP address', 'A computer virus that infects hypervisors', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (90, 5, 'What is the function of Extended Page Tables (EPT) or Nested Page Tables (NPT) in modern processors?', 'Hardware-assisted translation from guest physical memory to host physical memory to eliminate memory virtualization overhead', 'Allowing web browsers to open infinite tabs', 'Printing book pages at double speed', 'Formatting hard drives with FAT32 filesystems', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (91, 5, 'Which file format is standard for QEMU/KVM virtual disk images with copy-on-write capabilities?', '.MP3', '.QCOW2', '.DOCX', '.EXE', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (92, 5, 'What is a Virtual Machine Snapshot?', 'A photograph taken of the physical datacenter room', 'A point-in-time copy of a virtual machine''s disk state and memory, allowing instant rollback in case of error', 'A screenshot of the desktop background wallpaper', 'An audio recording of the server fan spinning', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (93, 5, 'Why are Type 2 Hypervisors generally unsuitable for enterprise cloud production environments?', 'They cannot run on Intel chips', 'They introduce severe performance overhead by running on top of an unnecessary host operating system layer', 'They only work when disconnected from the internet', 'They do not support keyboard inputs', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (94, 5, 'In x86 computer architecture, which ring level possesses the highest hardware privileges for kernel operations?', 'Ring 3', 'Ring 2', 'Ring 1', 'Ring 0', 'D');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (95, 5, 'What is an AMI in the context of Amazon Web Services?', 'Amazon Machine Image — a pre-configured template containing the OS, software, and configuration to launch an EC2 instance', 'Automated Management Interface', 'Advanced Motherboard Interconnect', 'Analog Modem Identification', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (96, 5, 'What network action occurs during the final phase of a Live VM Migration so switches route traffic to the new host?', 'A reboot of all physical routers in the building', 'The new host broadcasts a Gratuitous ARP (GARP) packet to update the network switches'' MAC address forwarding tables', 'The user must manually type a new IP address into their browser', 'The network cable must be manually unplugged and re-plugged', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (97, 5, 'What does ''Thin Provisioning'' mean for a virtual disk?', 'The disk only consumes physical storage space as data is actually written to it, rather than allocating all capacity upfront', 'The hard drive is physically made of ultra-thin aluminum foil', 'Only thin clients can read data from the disk', 'The disk automatically deletes files after 7 days', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (98, 5, 'Which hypervisor technology is integrated directly into the core Linux kernel?', 'KVM (Kernel-based Virtual Machine)', 'VirtualBox', 'VMware Workstation', 'Parallels Desktop', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (99, 5, 'What is the primary benefit of Open Virtualization Format (OVF)?', 'It allows open-source games to run faster', 'It provides an open, vendor-neutral standard for packaging and distributing virtual appliances across different hypervisors', 'It makes physical computer cases transparent', 'It encrypts video streaming services', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (100, 5, 'How does AWS Nitro architecture modernize traditional hypervisor virtualization?', 'By eliminating all virtual machines and returning to physical mainframes', 'By offloading virtualization tasks (networking, EBS storage, security) to dedicated hardware ASIC cards, freeing almost 100% of host CPU/RAM for guest VMs', 'By running the entire AWS cloud on smartphones', 'By using liquid nitrogen to cool individual processors', 'B');

-- Chapter 6: Cloud Storage and Data Management
INSERT INTO `chapters` (`chapter_id`, `course_id`, `chapter_number`, `module_title`, `chapter_title`, `summary_text`)
VALUES (6, 1, 6, 'Module 2: Core Technologies', 'Cloud Storage and Data Management', '### The Three Pillars of Cloud Storage
Data in the cloud is stored across three foundational storage architectures:
1. **Block Storage (e.g., AWS Elastic Block Store - EBS, Azure Managed Disks):**
   - Data is split into fixed-size blocks with unique identifiers. Acts like raw, unformatted physical hard drives attached directly to a virtual machine via high-speed storage fabric (NVMe over Fabrics / iSCSI).
   - *Best for:* Operating system boot drives, high-performance transactional databases (MySQL, PostgreSQL, Oracle), and random read/write I/O.
2. **File Storage (e.g., AWS Elastic File System - EFS, Azure Files):**
   - Data is organized in a hierarchical folder tree structure accessed via standard network protocols (NFS for Linux, SMB/CIFS for Windows).
   - *Best for:* Multi-instance shared storage where hundreds of VMs mount the same directory simultaneously (web content roots, shared media assets, developer homes).
3. **Object Storage (e.g., Amazon S3, Google Cloud Storage, Azure Blob Storage):**
   - Data is stored as discrete objects consisting of the payload, extensive customizable metadata, and a Globally Unique Identifier (URI) in a flat namespace (Buckets). Accessible globally over standard HTTP/HTTPS REST APIs.
   - *Best for:* Unstructured data (images, videos, backups, big data data lakes, static website hosting). Practically infinite scale and 99.999999999% (11 nines) durability.

### Distributed Data Systems: CAP Theorem
Formulated by Eric Brewer, the CAP theorem states that a distributed data store can simultaneously guarantee at most two out of three properties:
- **Consistency (C):** Every read receives the most recent write or an error.
- **Availability (A):** Every non-failing request receives a non-error response, without guarantee that it contains the most recent write.
- **Partition Tolerance (P):** The system continues to operate despite an arbitrary number of messages being dropped or delayed by the network between nodes.
Because network partitions (P) are physically inevitable in distributed networks, systems must choose between Consistency (**CP** - e.g., MongoDB, HBase, traditional RDBMS clusters) or Availability (**AP** - e.g., Amazon DynamoDB, Cassandra, DNS).

### Storage Lifecycle & Archiving
Cloud storage provides automated lifecycle management: transitioning frequently accessed data from Standard S3 tiers to Infrequent Access (S3-IA), and archiving cold compliance logs to ultra-low-cost tape/cold storage (AWS S3 Glacier Flexible / Glacier Deep Archive), cutting costs by up to 95%.')
ON DUPLICATE KEY UPDATE `chapter_title`=VALUES(`chapter_title`);

INSERT INTO `quizzes` (`quiz_id`, `chapter_id`, `title`, `time_limit_minutes`, `passing_percentage`, `total_questions`)
VALUES (6, 6, 'Chapter 6 Assessment: Cloud Storage and Data Management', 10, 75, 20)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (101, 6, 'Which cloud storage type functions like an unformatted physical raw hard drive attached to a virtual machine?', 'Object Storage', 'Block Storage', 'File Storage', 'Cold Archival Storage', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (102, 6, 'Which of the following is the premier example of an Object Storage service?', 'AWS Elastic File System (EFS)', 'Amazon Elastic Block Store (EBS)', 'Amazon Simple Storage Service (Amazon S3)', 'Linux SWAP partition', 'C');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (103, 6, 'What network protocols are typically used to mount cloud File Storage across multiple virtual machines?', 'NFS (Network File System) and SMB (Server Message Block)', 'SMTP and POP3', 'BGP and OSPF', 'SSH and Telnet', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (104, 6, 'How much durability is Amazon S3 Standard designed to provide for stored objects?', '90.0%', '99.0%', '99.999999999% (11 nines)', '100.0% with zero hardware failures forever', 'C');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (105, 6, 'What is the maximum file size for a single object in Amazon S3?', '5 Gigabytes', '500 Megabytes', '5 Terabytes', 'Unlimited single object size', 'C');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (106, 6, 'What does the CAP Theorem state regarding distributed data systems?', 'All cloud computers are permanently secure', 'A distributed system can guarantee at most two out of Consistency, Availability, and Partition Tolerance simultaneously', 'Storage capacity doubles every 18 months', 'Every database must run on MySQL', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (107, 6, 'Because network partitions (P) are physically inevitable in distributed networks, what fundamental architectural trade-off must designers make?', 'Choosing between CP (Consistency over Availability) or AP (Availability over Consistency)', 'Choosing between Windows or macOS', 'Choosing between keyboards or mice', 'Choosing between electricity or solar power', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (108, 6, 'In an Eventual Consistency model, what happens immediately after a write operation?', 'The entire database crashes and restarts', 'A read request immediately following the write might temporarily return stale data until all replicas synchronize', 'All other users are logged out permanently', 'The write is rejected and deleted', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (109, 6, 'Which storage service is specifically optimized for cold archiving compliance records with retrieval times of 3 to 5 hours or 12 hours at lowest cost?', 'Amazon S3 Glacier / S3 Glacier Deep Archive', 'AWS EBS Provisioned IOPS', 'RAM cache', 'Local NVMe instance store', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (110, 6, 'What is an S3 Lifecycle Rule?', 'A policy that automatically transitions objects between storage tiers or deletes them based on age', 'A biological law governing the lifespan of servers', 'A warranty contract for datacenter cooling fans', 'A rule requiring users to change passwords every 30 days', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (111, 6, 'Why is Block Storage (EBS) preferred over Object Storage (S3) for running relational database engines like MySQL or PostgreSQL?', 'Object storage is too expensive for text files', 'Databases require low-latency random read/write I/O operations and filesystem-level file locking that object storage does not support', 'MySQL does not run on Linux', 'Block storage does not require any passwords', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (112, 6, 'How do clients interact with and retrieve files from Object Storage?', 'Via standard HTTP/HTTPS REST API requests (e.g., GET, PUT, DELETE) using URLs', 'Using a physical SATA ribbon cable', 'By inserting a USB thumb drive into the cloud server', 'Through a BIOS setup menu', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (113, 6, 'What is the primary difference between AWS EBS and AWS EFS?', 'EBS is block storage attached to a single VM; EFS is shared file storage that can be mounted simultaneously by hundreds of VMs', 'EBS is free; EFS costs $10,000 per month', 'EBS is for Windows only; EFS is for Android phones only', 'EBS does not support encryption', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (114, 6, 'What is IOPS in storage performance benchmarking?', 'Input/Output Operations Per Second — measuring how many read/write operations a storage drive can perform each second', 'Internet Online Protocol Standard', 'Internal Operating Power Supply', 'Integrated Optical Processing Speed', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (115, 6, 'What is ''Instance Store'' (ephemeral storage) on AWS EC2?', 'Temporary block-level storage physically attached to the host server that is wiped and lost if the instance stops or terminates', 'Permanent storage backed up to magnetic tape', 'A retail store that sells cloud merchandise', 'A database table that stores user passwords', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (116, 6, 'Which of the following is considered ''Unstructured Data'' ideally suited for cloud object storage?', 'High-resolution video files, audio recordings, and medical imaging DICOM files', 'A strict 10-column relational SQL table of bank accounts', 'A CSV spreadsheet containing employee ID numbers', 'A primary key index file in Oracle DB', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (117, 6, 'What is the PACELC theorem an extension of?', 'Moore''s Law', 'The CAP Theorem — adding Latency (L) vs Consistency (C) trade-offs during normal operating conditions (Else - E)', 'Newton''s Third Law of Motion', 'Amdahl''s Law of Parallel Computing', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (118, 6, 'What does S3 Object Versioning protect against?', 'High electricity bills', 'Accidental deletions and unintended overwrites by retaining historical versions of every object', 'Server motherboards catching fire', 'Slow internet speeds', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (119, 6, 'What is the purpose of S3 Pre-Signed URLs?', 'Allowing users temporary secure access to download or upload a specific private S3 object without granting them AWS credentials', 'Signing an electronic lease for datacenter property', 'Registering a domain name with ICANN', 'Translating URLs into physical street addresses', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (120, 6, 'In distributed database replication, what is a ''Split-Brain'' scenario?', 'When a programmer forgets how their code works', 'When a network partition causes two isolated clusters of nodes to both believe they are the active primary, accepting conflicting writes', 'When a processor chip cracks physically in half', 'When an operating system runs two web browsers at the same time', 'B');

-- Chapter 7: Cloud Networking
INSERT INTO `chapters` (`chapter_id`, `course_id`, `chapter_number`, `module_title`, `chapter_title`, `summary_text`)
VALUES (7, 1, 7, 'Module 2: Core Technologies', 'Cloud Networking', '### Virtual Private Cloud (VPC) Architecture
A Virtual Private Cloud (VPC) is a logically isolated virtual network dedicated to a cloud customer''s account, closely mirroring a traditional on-premises data center network with the benefits of cloud scalability.

### Subnetting & CIDR Notation
- **CIDR (Classless Inter-Domain Routing):** Defines IP address ranges using prefix notation (`IP/prefix`). The prefix designates the number of fixed network bits:
  - `10.0.0.0/16` provides $2^{(32-16)} = 65,536$ total IP addresses.
  - `10.0.1.0/24` provides $2^{(32-24)} = 256$ IP addresses (AWS reserves 5 addresses per subnet, leaving 251 usable).
- **Public Subnet:** Contains a route pointing directly to an **Internet Gateway (IGW)**. Resources (e.g. public load balancers, web servers) can receive direct public inbound internet traffic.
- **Private Subnet:** Does NOT have a direct route to an Internet Gateway. Outbound traffic to the internet (for software updates) is routed through a **Network Address Translation (NAT) Gateway** situated in a public subnet. Resources (e.g. backend databases, microservices) have zero direct inbound internet accessibility.

### Network Defense in Depth: Security Groups vs. NACLs
1. **Security Groups (Instance Level):**
   - **Stateful:** If an inbound request is permitted on port 443, the outbound return traffic is automatically allowed regardless of outbound rules.
   - Operates at the virtual network interface (ENI) level.
   - Evaluates all rules before deciding; supports ALLOW rules only (implicit deny).
2. **Network Access Control Lists - NACLs (Subnet Level):**
   - **Stateless:** Outbound return traffic must be explicitly permitted through ephemeral ports (1024-65535).
   - Operates at the subnet boundary as a secondary perimeter filter.
   - Evaluates rules in strict numerical order (lowest rule number first); supports both explicit ALLOW and DENY rules.

### Load Balancing & Edge Acceleration
- **Application Load Balancer (ALB):** Layer 7 (HTTP/HTTPS) intelligent routing based on URL paths (`/api` vs `/images`), host headers, and HTTP methods.
- **Network Load Balancer (NLB):** Layer 4 (TCP/UDP) ultra-high performance handling millions of requests per second with volatile traffic patterns and static IP allocation.
- **Content Delivery Network (CDN - e.g. Amazon CloudFront):** Caches static assets (images, CSS, JS) at hundreds of global Point of Presence (PoP) edge locations to slash latency.')
ON DUPLICATE KEY UPDATE `chapter_title`=VALUES(`chapter_title`);

INSERT INTO `quizzes` (`quiz_id`, `chapter_id`, `title`, `time_limit_minutes`, `passing_percentage`, `total_questions`)
VALUES (7, 7, 'Chapter 7 Assessment: Cloud Networking', 10, 75, 20)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (121, 7, 'What does VPC stand for in cloud computing?', 'Virtual Private Cloud', 'Virtual Public Connection', 'Variable Protocol Controller', 'Verified Personal Computer', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (122, 7, 'In CIDR notation, how many total IP addresses are in a /24 network block?', '65,536', '256', '16', '1,024', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (123, 7, 'How many IP addresses does AWS reserve for internal networking purposes in every subnet?', '0 addresses', '5 addresses (Network, VPC router, DNS, future use, and broadcast)', '100 addresses', '1 address', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (124, 7, 'What distinguishes a Public Subnet from a Private Subnet in a VPC?', 'Public subnets use Windows; private subnets use Linux', 'A public subnet has a route table entry pointing directly to an Internet Gateway (IGW)', 'Public subnets are completely unencrypted', 'Private subnets do not require IP addresses', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (125, 7, 'What is the purpose of a NAT Gateway in a cloud VPC?', 'To allow public internet users to hack database servers', 'To allow instances in a private subnet to initiate outbound connections to the internet (for updates) while preventing unsolicited inbound connections from the internet', 'To speed up audio streaming for video games', 'To assign physical MAC addresses to server racks', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (126, 7, 'What is the primary operational difference between Security Groups and Network Access Control Lists (NACLs)?', 'Security Groups are stateful (instance level); NACLs are stateless (subnet level)', 'Security Groups only work on Mondays; NACLs work every day', 'Security Groups require hardware cables; NACLs run in software', 'NACLs are stateful; Security Groups are stateless', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (127, 7, 'If you permit inbound traffic on port 443 in a stateful Security Group, what outbound rule is required for the response traffic?', 'You must create an outbound rule permitting port 443 explicitly', 'No outbound rule is needed because stateful firewalls automatically allow response traffic for permitted inbound sessions', 'You must restart the virtual machine', 'You must configure a NAT Gateway', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (128, 7, 'Which type of firewall rules are supported by Network Access Control Lists (NACLs)?', 'ALLOW rules only', 'Both explicit ALLOW and explicit DENY rules, evaluated in numerical order', 'DENY rules only', 'No rules; NACLs are open by default', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (129, 7, 'Which AWS Load Balancer operates at Layer 7 of the OSI model and can route traffic based on HTTP request path or host headers?', 'Classic Load Balancer (CLB)', 'Application Load Balancer (ALB)', 'Network Load Balancer (NLB)', 'Gateway Load Balancer (GWLB)', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (130, 7, 'Which Load Balancer operates at Layer 4 (TCP/UDP) and is engineered for ultra-high throughput with tens of millions of requests per second?', 'Application Load Balancer (ALB)', 'Network Load Balancer (NLB)', 'Session Load Balancer', 'Content Routing Balancer', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (131, 7, 'What is Amazon Route 53?', 'A physical highway in Seattle, Washington', 'A highly available and scalable cloud Domain Name System (DNS) web service', 'A network firewall for filtering DDoS attacks', 'A server monitoring tool for CPU temperatures', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (132, 7, 'What is the primary function of a Content Delivery Network (CDN) such as Amazon CloudFront?', 'To replace all database servers with flat text files', 'To cache static and dynamic web content at global edge locations close to users, reducing latency and origin server load', 'To compile C++ source code in the cloud', 'To physically mail hard drives to customer offices', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (133, 7, 'What does ''Non-Transitive'' mean in VPC Peering?', 'Traffic travels in one direction only', 'If VPC A is peered with VPC B, and VPC B is peered with VPC C, VPC A cannot communicate with VPC C through VPC B without a direct peering link', 'VPC peering does not support IPv4', 'Peering connections automatically expire after 1 hour', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (134, 7, 'What AWS service acts as a centralized cloud hub router connecting thousands of VPCs and on-premises networks in a hub-and-spoke model?', 'AWS Transit Gateway', 'Internet Gateway', 'NAT Instance', 'Route 53 Resolver', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (135, 7, 'What is AWS PrivateLink (VPC Endpoints)?', 'A private chat application for AWS developers', 'A mechanism to privately connect your VPC to supported AWS services (like S3) without traversing the public internet', 'A public URL shortener', 'A tool to expose private databases directly to the public web', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (136, 7, 'What is an Elastic IP address (EIP) in AWS?', 'An IP address that stretches over physical cables', 'A static, public IPv4 address allocated to your account that can be rapidly remapped to different instances during failures', 'A private IP address that changes every 5 minutes', 'An IP address assigned to mobile phones only', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (137, 7, 'In a typical secure 3-tier web architecture, where should the relational database (e.g. MySQL) be placed?', 'In the public subnet with an Internet Gateway route', 'In a private subnet with no direct route to the Internet Gateway, accessible only by the application tier', 'On a public CDN edge location', 'Directly on an unencrypted DNS server', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (138, 7, 'What Route 53 routing policy routes user DNS requests to the resource that provides the lowest network latency?', 'Simple Routing', 'Latency-Based Routing', 'Geolocation Routing', 'Weighted Routing', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (139, 7, 'What is the primary role of a Route Table in a VPC?', 'A table listing employee names and phone numbers', 'A set of rules (routes) that determine where network packets from subnets or gateways are directed', 'A database table that records SQL transactions', 'A hardware table used to assemble physical servers', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (140, 7, 'What is an Ephemeral Port range, and why is it important in stateless NACL rule configuration?', 'Ports 1-1024 used for secure web browsing', 'Short-lived client port ranges (typically 1024-65535) used for return traffic, which stateless NACLs must permit on outbound rules', 'Physical USB ports on a server front panel', 'Virtual ports that only exist during leap years', 'B');

-- Chapter 8: Cloud Security and Privacy
INSERT INTO `chapters` (`chapter_id`, `course_id`, `chapter_number`, `module_title`, `chapter_title`, `summary_text`)
VALUES (8, 1, 8, 'Module 3: Security, Operations, and Platforms', 'Cloud Security and Privacy', '### Foundations of Cloud Security
Security in cloud environments is governed by the **Shared Responsibility Model**. While cloud service providers secure the underlying hardware, physical facilities, hypervisors, and global network infrastructure ("Security OF the Cloud"), customers bear the ultimate legal responsibility for data security, access credentials, operating system patching, firewall rules, and application vulnerabilities ("Security IN the Cloud").

### Identity and Access Management (IAM)
IAM forms the ultimate security perimeter in the cloud, replacing obsolete physical castle-and-moat perimeter models with Zero-Trust identity verification:
- **Principle of Least Privilege (PoLP):** Users, services, and applications should be granted only the minimum permissions necessary to accomplish their assigned job tasks—never wildcards (`*`).
- **Role-Based Access Control (RBAC):** Permissions are assigned to logical groups or roles rather than individual user identities.
- **Multi-Factor Authentication (MFA):** Requires at least two distinct authentication factors: something you know (password), something you have (FIDO hardware key / TOTP app), or something you are (biometrics).
- **IAM Roles vs. Users:** IAM Roles provide short-lived temporary security credentials (via AWS STS) for services or EC2 instances, eliminating hazardous hard-coded access keys in source code.

### Cryptographic Protection & Key Management
- **Encryption in Transit:** Enforced using modern Transport Layer Security (TLS 1.3) protocols to defeat eavesdropping and man-in-the-middle (MITM) attacks.
- **Encryption at Rest:** Protecting data written to persistent disks or object stores using AES-256 bit symmetric ciphers.
- **Envelope Encryption:** A two-tier key hierarchy where plaintext data is encrypted with a unique Data Key (plaintext key is wiped from memory), and the Data Key is in turn encrypted using a Customer Master Key (CMK) managed within a hardware security module (HSM) such as AWS KMS.

### Major Regulatory Compliance Frameworks
- **SOC 2 Type II:** Independent audit of service organization controls over security, availability, processing integrity, confidentiality, and privacy.
- **ISO/IEC 27001:** Global standard for establishing, implementing, and maintaining an Information Security Management System (ISMS).
- **GDPR:** EU regulation granting users the Right to Be Forgotten, mandatory 72-hour breach notification, and strict data sovereignty restrictions.
- **HIPAA:** US healthcare framework mandating stringent physical and electronic protections for Protected Health Information (PHI).')
ON DUPLICATE KEY UPDATE `chapter_title`=VALUES(`chapter_title`);

INSERT INTO `quizzes` (`quiz_id`, `chapter_id`, `title`, `time_limit_minutes`, `passing_percentage`, `total_questions`)
VALUES (8, 8, 'Chapter 8 Assessment: Cloud Security and Privacy', 10, 75, 20)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (141, 8, 'What security principle dictates that users and services should only be granted the minimum permissions necessary to perform their jobs?', 'Principle of Maximum Availability', 'Principle of Least Privilege (PoLP)', 'Principle of Infinite Redundancy', 'Principle of Open Access', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (142, 8, 'Under the Cloud Shared Responsibility Model, who is responsible for the physical security of the cloud provider''s datacenters?', 'The Cloud Service Provider (CSP)', 'The customer organization', 'The local municipal police', 'The individual software developer', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (143, 8, 'Which authentication mechanism requires a user to supply at least two independent types of credentials before granting access?', 'Single Sign-On (SSO)', 'Multi-Factor Authentication (MFA)', 'Basic HTTP Authentication', 'Anonymous Guest Access', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (144, 8, 'Why should developers use IAM Roles with instance profiles rather than embedding long-term API access keys inside application source code?', 'IAM Roles make code compile faster', 'IAM Roles provide short-lived temporary security credentials that rotate automatically, preventing credential leaks if code is compromised', 'IAM Roles are free whereas API keys cost $100 each', 'IAM Roles allow unlimited public database access', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (145, 8, 'What encryption standard is universally utilized as the benchmark for symmetric data encryption at rest in modern clouds?', 'MD5', 'AES-256 (Advanced Encryption Standard 256-bit)', 'ROT13', 'DES 56-bit', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (146, 8, 'What is ''Envelope Encryption'' in cloud cryptography?', 'Mailing encryption keys inside physical paper envelopes', 'Encrypting plaintext data with a unique Data Key, and then encrypting that Data Key with a root Customer Master Key (CMK)', 'Hiding passwords inside HTML comments', 'Wrapping server cables in aluminum foil', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (147, 8, 'What protocol is used to secure Data in Transit over the web?', 'Transport Layer Security (TLS / HTTPS)', 'Telnet', 'Plain HTTP over port 80', 'FTP', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (148, 8, 'What is AWS CloudTrail?', 'A hiking trail located near Amazon headquarters', 'A service that records every API call and user action made in an AWS account for governance and auditing', 'A tool to track delivery of physical Amazon packages', 'A programming language used for cloud microservices', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (149, 8, 'What does GDPR stand for, and what major right does it grant individuals regarding their data?', 'General Data Protection Regulation — grants the ''Right to Be Forgotten'' (data erasure) and strict consent controls', 'Global Data Processing Resource', 'Government Distributed Protocol Requirement', 'General Database Protection Routine', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (150, 8, 'What US regulation protects the privacy and confidentiality of Protected Health Information (PHI)?', 'PCI-DSS', 'HIPAA (Health Insurance Portability and Accountability Act)', 'DMCA', 'OSHA', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (151, 8, 'What is the single most common cause of security breaches in public cloud environments according to major cybersecurity reports?', 'Physical theft of hard drives from datacenters', 'Customer misconfigurations (e.g. overly permissive IAM policies or public S3 buckets)', 'Solar flares corrupting server memory', 'Physical damage to undersea fiber cables', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (152, 8, 'What is a DDoS (Distributed Denial of Service) attack?', 'An attacker physically cutting power lines to a data center', 'An attempt to overwhelm an online service with a flood of illegitimate traffic originating from thousands of distributed botnet devices', 'A database error caused by a missing semicolon', 'A hardware failure of an individual CPU core', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (153, 8, 'Which AWS managed service provides automated DDoS protection for web applications?', 'AWS Shield', 'AWS Lambda', 'Amazon S3', 'Amazon RDS', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (154, 8, 'What does Role-Based Access Control (RBAC) do?', 'Assigns permissions to roles based on organizational responsibilities, rather than managing individual user privileges directly', 'Assigns administrative permissions based on employee age', 'Rotates physical computer desks every week', 'Enforces password changes every 10 minutes', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (155, 8, 'What is a Web Application Firewall (WAF) designed to inspect and block?', 'Physical fire in a server room', 'Application layer (Layer 7) web exploits like SQL Injection (SQLi) and Cross-Site Scripting (XSS)', 'Hardware voltage spikes in power supplies', 'Unplugged Ethernet cables', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (156, 8, 'What is a Hardware Security Module (HSM)?', 'A physical computing device that safeguards and manages cryptographic keys and performs cryptographic operations inside tamper-resistant hardware', 'A cooling fan for graphic processing units', 'A type of fiber optic network cable', 'A monitor cable adapter', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (157, 8, 'What audit report verifies a service provider''s operational controls over security, availability, and confidentiality across an extended observation period?', 'SOC 2 Type II', 'Driver''s license record', 'Standard invoice receipt', 'Git commit history', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (158, 8, 'What is the primary risk of using the Root Account of a cloud provider for day-to-day administrative activities?', 'It has unrestricted, irrevocable access to all resources and billing; compromise gives attackers complete ownership of the entire organization', 'It slows down internet connection speeds', 'It causes servers to run out of disk space', 'It cancels all existing customer credit cards', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (159, 8, 'What does ''Confidential Computing'' (Data in Use encryption) provide?', 'Hardware-based Trusted Execution Environments (TEEs) that keep data encrypted in RAM even while active processing occurs', 'NDAs signed by datacenter cleaning staff', 'Turning off computer monitors when leaving desks', 'Encrypting only outgoing email messages', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (160, 8, 'What is AWS GuardDuty?', 'An armed security officer stationed at AWS gates', 'An intelligent threat detection service that continuously monitors AWS accounts using machine learning and threat intelligence feeds', 'A backup battery for desktop computers', 'A compiler for Rust applications', 'B');

-- Chapter 9: Containers and Serverless Computing
INSERT INTO `chapters` (`chapter_id`, `course_id`, `chapter_number`, `module_title`, `chapter_title`, `summary_text`)
VALUES (9, 1, 9, 'Module 3: Security, Operations, and Platforms', 'Containers and Serverless Computing', '### The Container Revolution
Containers package an application''s code, runtime, system tools, and libraries into a lightweight, standalone, executable unit. Unlike Virtual Machines—which virtualize physical hardware and require a complete guest operating system—containers share the host operating system''s kernel, using Linux **namespaces** (for process, network, and mount isolation) and **cgroups** (control groups for CPU, memory, and I/O throttling).
- **Virtual Machine:** Hypervisor + Full Guest OS (Gigabytes, boots in minutes).
- **Container:** Shared Host OS Kernel + User Space Binaries (Megabytes, boots in milliseconds).

### Docker Architecture
- **Dockerfile:** A text blueprint containing sequential instructions (`FROM`, `COPY`, `RUN`, `EXPOSE`, `CMD`) to build an immutable image.
- **Docker Image:** A read-only, layered template built using an Overlay/Union File System where shared base layers are cached efficiently.
- **Docker Container:** A runnable, isolated instance of an image with a thin read-write scratch layer on top.
- **Registry:** Repositories for publishing and distributing images (e.g., Docker Hub, Amazon ECR, GitHub Packages).

### Container Orchestration with Kubernetes (K8s)
As container counts swell into the thousands, orchestration platforms automate scheduling, self-healing, rolling updates, and networking:
- **Pod:** The smallest deployable computing unit in Kubernetes, wrapping one or more tightly coupled containers sharing network IP and storage.
- **Deployment:** Declarative specification describing desired state (e.g., "maintain 5 replicas of the payment pod"); automates zero-downtime rolling updates.
- **Service:** An abstraction defining a logical set of Pods and a policy to access them (ClusterIP, NodePort, LoadBalancer).
- **Ingress:** Manages external HTTP/S routing into cluster services.

### Serverless & Function as a Service (FaaS)
Serverless moves beyond container management into pure event-driven computation:
- **AWS Lambda / Google Cloud Functions:** Executes code in response to events (HTTP API Gateway trigger, S3 file upload, Kafka stream event) without provisioning servers.
- **Micro-Billing:** Billed strictly per millisecond of compute duration.
- **Cold Starts:** Latency incurred when a serverless platform initializes a fresh execution container from scratch. Mitigated using provisioned concurrency and lightweight runtimes.')
ON DUPLICATE KEY UPDATE `chapter_title`=VALUES(`chapter_title`);

INSERT INTO `quizzes` (`quiz_id`, `chapter_id`, `title`, `time_limit_minutes`, `passing_percentage`, `total_questions`)
VALUES (9, 9, 'Chapter 9 Assessment: Containers and Serverless Computing', 10, 75, 20)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (161, 9, 'What is the primary architectural difference between a Docker container and a traditional Virtual Machine?', 'Containers require physical hardware ribbons', 'Containers share the host operating system kernel and isolate user space, whereas VMs virtualize hardware and run complete separate guest operating systems', 'Containers can only run Windows 95', 'VMs do not require processors', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (162, 9, 'Which Linux kernel feature provides process, network, and filesystem isolation for containers?', 'Namespaces', 'BIOS', 'FAT32', 'Swap partitions', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (163, 9, 'Which Linux kernel feature is used to enforce resource limits (e.g. capping CPU and RAM usage) on containers?', 'Control Groups (cgroups)', 'X11 Window System', 'DNS', 'BASH aliases', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (164, 9, 'What is a Dockerfile?', 'A digital photograph of a shipping vessel', 'A text configuration file containing instructions to automate the building of a Docker container image', 'A spreadsheet of monthly cloud bills', 'An encrypted virus database', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (165, 9, 'In Docker, what is the layer property that allows multiple running containers to share the exact same base image in memory safely?', 'Copy-on-Write (CoW) / Union File System', 'Direct Memory Access', 'Analog Tape Mirroring', 'Read-Only BIOS Chips', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (166, 9, 'What is the smallest deployable computing unit in Kubernetes?', 'Node', 'Pod', 'Cluster', 'Virtual Machine', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (167, 9, 'In Kubernetes architecture, what distributed key-value store holds the entire cluster state and configuration data?', 'etcd', 'Redis', 'MySQL', 'MongoDB', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (168, 9, 'What is the role of the kube-scheduler in a Kubernetes cluster?', 'To schedule employee lunch breaks', 'To select the most appropriate worker node to run newly created or unscheduled Pods based on resource requirements', 'To compile software code into binaries', 'To send email receipts to customers', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (169, 9, 'Which Kubernetes resource manages stateless application replicas and enables zero-downtime rolling updates?', 'Deployment', 'Namespace', 'ConfigMap', 'Secret', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (170, 9, 'What is the purpose of a Kubernetes Service abstraction?', 'To clean server rooms on weekends', 'To provide a permanent, stable IP address and DNS name that load balances traffic across dynamic, ephemeral Pods', 'To calculate billing taxes', 'To format hard drives on worker nodes', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (171, 9, 'What is AWS Lambda?', 'A physical microchip manufactured by Amazon', 'A serverless compute service that runs code in response to events and automatically manages the underlying compute resources', 'A relational database engine', 'A satellite ground station', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (172, 9, 'In serverless computing, what is a ''Cold Start''?', 'A computer freezing during winter weather', 'The latency delay experienced when a cloud provider boots up a new container runtime environment to service an incoming request', 'Rebooting a desktop computer with a power switch', 'Running a code compiler without internet access', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (173, 9, 'How can developers mitigate serverless cold-start latency for latency-sensitive production APIs?', 'Using AWS Lambda Provisioned Concurrency to keep pre-warmed execution environments ready', 'Writing 50,000 lines of unused code', 'Turning off HTTPS encryption', 'Using mechanical hard drives', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (174, 9, 'What billing model does AWS Lambda utilize?', 'Pay strictly per millisecond of compute execution time and number of requests, with zero cost when idle', 'Flat monthly fee of $500', 'Hourly rental fees regardless of whether code runs', 'Annual upfront licensing contracts', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (175, 9, 'Which Kubernetes component runs on every worker node and ensures that containers described in PodSpecs are running and healthy?', 'kubelet', 'etcd', 'kube-controller-manager', 'CloudTrail', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (176, 9, 'What is a Container Registry?', 'A legal courthouse for shipping containers', 'A centralized repository for storing, tagging, and distributing compiled container images (e.g. Docker Hub, Amazon ECR)', 'A log file on an operating system', 'A spreadsheet of user passwords', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (177, 9, 'Why must serverless functions be designed as ''Stateless''?', 'Because serverless containers are ephemeral and can be destroyed immediately after execution completes', 'Because serverless does not support math equations', 'Because serverless code cannot access databases', 'Because stateful code is prohibited by law', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (178, 9, 'What is Kubernetes Ingress?', 'A tool to delete worker nodes', 'An API object that manages external HTTP and HTTPS routing to services within the cluster, offering SSL termination and path routing', 'A hardware network switch installed in a datacenter', 'A command-line text editor', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (179, 9, 'Which command in a Dockerfile defines the default executable and parameters to run when the container starts?', 'CMD or ENTRYPOINT', 'FROM', 'MAINTAINER', 'EXPOSE', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (180, 9, 'In microservices architectures, what is the role of an API Gateway in front of Serverless functions?', 'It acts as the single entrypoint for clients, handling routing, SSL termination, rate limiting, and mapping HTTP requests to FaaS triggers', 'It converts web pages into paper printouts', 'It powers off cloud datacenters at night', 'It replaces all frontend CSS stylesheets', 'A');

-- Chapter 10: Major Cloud Platforms (AWS, Azure, GCP)
INSERT INTO `chapters` (`chapter_id`, `course_id`, `chapter_number`, `module_title`, `chapter_title`, `summary_text`)
VALUES (10, 1, 10, 'Module 3: Security, Operations, and Platforms', 'Major Cloud Platforms (AWS, Azure, GCP)', '### The Hyperscale Cloud Landscape
The public cloud market is dominated by three global hyper-scalers, collectively commanding over two-thirds of worldwide cloud infrastructure spending:
1. **Amazon Web Services (AWS):** Launched in 2006, AWS is the pioneer and current market share leader. Known for its staggering breadth and depth of specialized services, granular configuration controls, mature global partner ecosystem, and massive developer community.
2. **Microsoft Azure:** Launched in 2010, Azure is the enterprise powerhouse. Its core strength lies in seamless integration with legacy Microsoft enterprise ecosystems (Active Directory, Windows Server, SQL Server, Office 365 / Entra ID) and hybrid enterprise deployments (Azure Arc, Azure Stack).
3. **Google Cloud Platform (GCP):** Known for engineering excellence in big data analytics, distributed data processing, container innovation (birthplace of Kubernetes), and artificial intelligence/machine learning (TensorFlow, BigQuery, Vertex AI, TPU silicon).

### Service Mapping Matrix
- **Compute:** AWS EC2 $\\leftrightarrow$ Azure Virtual Machines $\\leftrightarrow$ GCP Compute Engine
- **Serverless Compute:** AWS Lambda $\\leftrightarrow$ Azure Functions $\\leftrightarrow$ GCP Cloud Functions / Cloud Run
- **Object Storage:** Amazon S3 $\\leftrightarrow$ Azure Blob Storage $\\leftrightarrow$ Google Cloud Storage
- **Relational DB:** Amazon RDS / Aurora $\\leftrightarrow$ Azure SQL Database $\\leftrightarrow$ Cloud SQL / Cloud Spanner
- **NoSQL DB:** Amazon DynamoDB $\\leftrightarrow$ Azure Cosmos DB $\\leftrightarrow$ Google Cloud Firestore / Bigtable
- **Containers:** AWS EKS $\\leftrightarrow$ Azure AKS $\\leftrightarrow$ Google GKE (Google Kubernetes Engine)
- **Identity:** AWS IAM $\\leftrightarrow$ Microsoft Entra ID (Azure AD) $\\leftrightarrow$ Google Cloud IAM

### Multi-Cloud & Vendor Lock-In
Architects face strategic dilemmas regarding cloud-native services vs. cloud-agnostic abstractions. Utilizing proprietary vendor services (e.g. AWS Aurora, Azure Cosmos DB) yields high developer productivity and performance, but binds the architecture to that specific vendor. Utilizing portable standards (containers, PostgreSQL, Kubernetes, Terraform) preserves workload mobility across AWS, Azure, and GCP.')
ON DUPLICATE KEY UPDATE `chapter_title`=VALUES(`chapter_title`);

INSERT INTO `quizzes` (`quiz_id`, `chapter_id`, `title`, `time_limit_minutes`, `passing_percentage`, `total_questions`)
VALUES (10, 10, 'Chapter 10 Assessment: Major Cloud Platforms (AWS, Azure, GCP)', 10, 75, 20)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (181, 10, 'Which public cloud platform was launched first in 2006, pioneering the modern commercial IaaS market?', 'Microsoft Azure', 'Google Cloud Platform', 'Amazon Web Services (AWS)', 'IBM Cloud', 'C');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (182, 10, 'What is Microsoft Azure''s equivalent service to Amazon EC2?', 'Azure Virtual Machines', 'Azure Blob Storage', 'Azure Functions', 'Azure DevOps', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (183, 10, 'What is Google Cloud Platform''s equivalent service to Amazon S3?', 'Google Cloud Storage (GCS)', 'Google Compute Engine', 'Google BigQuery', 'Google App Engine', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (184, 10, 'Which major enterprise identity and directory service gives Microsoft Azure a distinct competitive advantage in corporate environments?', 'Microsoft Entra ID (formerly Azure Active Directory)', 'Google Accounts', 'Apple ID', 'Linux PAM', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (185, 10, 'Which Google Cloud database service was the first globally distributed database to achieve both External Consistency (ACID) and High Availability using atomic clocks?', 'Cloud SQL', 'Cloud Spanner', 'Cloud Bigtable', 'Cloud Datastore', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (186, 10, 'What is Google Cloud''s premier serverless, petabyte-scale data warehouse service for analytical SQL queries?', 'BigQuery', 'Amazon Athena', 'Azure Synapse', 'MySQL Workbench', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (187, 10, 'What is the name of Microsoft Azure''s globally distributed multi-model NoSQL database that offers 5 customizable consistency levels?', 'Azure Cosmos DB', 'Azure SQL Database', 'Azure Blob DB', 'Azure Data Lake', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (188, 10, 'What managed Kubernetes service is offered by Google Cloud Platform?', 'Amazon EKS', 'Google Kubernetes Engine (GKE)', 'Azure AKS', 'OpenShift', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (189, 10, 'Which cloud provider has an exclusive partnership to host OpenAI''s large language model APIs (e.g. GPT-4)?', 'Microsoft Azure', 'Amazon Web Services', 'Alibaba Cloud', 'Oracle Cloud', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (190, 10, 'What custom AI processor silicon did Google engineer specifically for training and inferencing large neural networks in the cloud?', 'TPU (Tensor Processing Unit)', 'Intel Pentium', 'AMD Ryzen', 'Nvidia GeForce 256', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (191, 10, 'What is Amazon''s custom ARM-based server CPU family designed for high efficiency and lower cloud compute costs?', 'AWS Graviton', 'AWS Nitro', 'AWS Xeon', 'AWS Snapdragon', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (192, 10, 'What open-source Infrastructure as Code tool enables provisioning across AWS, Azure, and GCP using a unified declarative syntax?', 'HashiCorp Terraform', 'AWS CloudFormation', 'Azure Bicep', 'Google Deployment Manager', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (193, 10, 'What is ''Vendor Lock-in''?', 'A physical lock placed on a datacenter server rack', 'A situation where a customer becomes dependent on a single cloud vendor''s proprietary technologies, making migration prohibitively costly', 'A vendor refusing to sell computers to students', 'A contract requiring developers to work exclusively on Windows', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (194, 10, 'Which of the following database choices minimizes cloud vendor lock-in for a web application?', 'Standard open-source PostgreSQL running on managed database instances', 'Amazon DynamoDB with proprietary AWS SDK calls', 'Azure Cosmos DB Table API', 'Google Cloud Spanner', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (195, 10, 'What is Google Cloud''s serverless container platform that automatically scales arbitrary HTTP containers to zero?', 'Cloud Run', 'Cloud Build', 'Cloud Composer', 'Cloud Shell', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (196, 10, 'What is Azure Arc?', 'A video game released by Microsoft', 'A hybrid and multi-cloud management platform that extends Azure governance, services, and policies to on-premises, AWS, and GCP environments', 'A physical electrical battery for Azure servers', 'A web browser developed for Linux', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (197, 10, 'How does Google Cloud organize resources hierarchically for identity and billing management?', 'Organization -> Folders -> Projects -> Resources', 'User -> Password -> Database -> Table', 'Single flat list of IP addresses', 'Alphabetical order by file size', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (198, 10, 'Which cloud provider is historically recognized for offering the largest total number of distinct, specialized cloud services and features?', 'Amazon Web Services (AWS)', 'DigitalOcean', 'Linode', 'Heroku', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (199, 10, 'What is AWS Fargate?', 'A serverless compute engine for containers that works with both Amazon ECS and EKS without requiring you to manage EC2 worker instances', 'A physical toll booth outside Amazon datacenters', 'A network firewall for filtering malware', 'A tool to monitor electrical wattage', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (200, 10, 'Why might a large enterprise deliberately choose a Multi-Cloud architecture despite higher operational overhead?', 'To eliminate single-vendor dependency, satisfy government regulations, and leverage specialized best-of-breed services from different providers', 'Because single cloud providers are prohibited from having more than 10 customers', 'To avoid using internet cables', 'Because multi-cloud is completely free of charge', 'A');

-- Chapter 11: Cloud Governance, Cost Management, and Ethics
INSERT INTO `chapters` (`chapter_id`, `course_id`, `chapter_number`, `module_title`, `chapter_title`, `summary_text`)
VALUES (11, 1, 11, 'Module 3: Security, Operations, and Platforms', 'Cloud Governance, Cost Management, and Ethics', '### The Cloud Financial Paradigm & FinOps
The shift from CapEx to OpEx grants software engineers unprecedented authority to provision infrastructure with a few clicks or API calls. Without centralized financial governance, this agility invariably causes runaway cloud spending and "bill shock."
**FinOps (Financial Operations)** is an evolving cloud financial management discipline and cultural practice that enables organizations to maximize business value by helping engineering, finance, technology, and business teams collaborate on data-driven spending decisions.
The FinOps lifecycle operates in three continuous phases:
1. **Inform:** Visibility into costs, resource allocation, and real-time telemetry using allocation tags and unit economics.
2. **Optimize:** Identifying waste, rightsizing over-provisioned instances, terminating orphaned EBS volumes, and selecting optimal purchasing models.
3. **Operate:** Continuous evaluation against business KPIs, automated policy enforcement, and engineering accountability.

### Cloud Purchasing Models
- **On-Demand:** Maximum flexibility, zero commitment, billed per second/hour. Highest price point; ideal for unpredictable spikes or short-term dev workloads.
- **Reserved Instances (RIs) / Savings Plans:** 1-year or 3-year commitment to a consistent amount of compute usage (e.g. $10/hour). Delivers up to 72% discounts compared to On-Demand.
- **Spot Instances:** Bidding on unused cloud provider capacity at steep discounts (up to 90% off). The provider can reclaim the instance with a 2-minute interruption notice; ideal for fault-tolerant batch workloads, ML training, and stateless web tiers.

### Governance, Tagging, and Compliance Guardrails
- **Tagging Strategy:** Key-value metadata attached to resources (`Environment: Production`, `CostCenter: 4012`, `Owner: MariaSantos`, `Project: LMS`). Tags are mandatory for cost allocation and automated lifecycle policies.
- **Service Control Policies (SCPs):** Organizational guardrails that define the maximum permissions account members can exercise (e.g. banning deployment in non-compliant regions or prohibiting unencrypted storage creation).

### Green Computing & Cloud Ethics
Hyperscale cloud data centers consume gigawatts of electricity and massive quantities of water for cooling. Hyperscalers strive for Net Zero carbon footprints, operating at significantly higher Power Usage Effectiveness (PUE) ratios (~1.1-1.2) than private enterprise data centers (~1.6-2.0). Ethical cloud engineering demands minimizing resource waste, respecting data privacy rights, and avoiding carbon-intensive over-provisioning.')
ON DUPLICATE KEY UPDATE `chapter_title`=VALUES(`chapter_title`);

INSERT INTO `quizzes` (`quiz_id`, `chapter_id`, `title`, `time_limit_minutes`, `passing_percentage`, `total_questions`)
VALUES (11, 11, 'Chapter 11 Assessment: Cloud Governance, Cost Management, and Ethics', 10, 75, 20)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (201, 11, 'What is FinOps in cloud computing?', 'A software compiler for financial calculation spreadsheets', 'The operational and cultural practice that brings financial accountability to cloud spending, maximizing business value', 'A financial loan provided by cloud providers to purchase servers', 'A cryptocurrency protocol', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (202, 11, 'Which cloud purchasing model offers up to 90% discounts by allowing customers to bid on unused cloud compute capacity, with the caveat of a 2-minute interruption notice?', 'On-Demand Instances', 'Spot Instances', 'Dedicated Hosts', 'Standard Reserved Instances', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (203, 11, 'What discount level is typically achieved by committing to a 1-year or 3-year Savings Plan or Reserved Instance?', '0% discount', 'Up to 72% discount compared to On-Demand pricing', '100% free compute forever', 'Exactly 5% discount', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (204, 11, 'Which of the following workloads is LEAST suited for Spot Instances?', 'Batch image processing jobs', 'Distributed machine learning model training with checkpoints', 'A mission-critical monolithic core banking transaction database', 'Stateless container CI/CD testing runners', 'C');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (205, 11, 'What is ''Rightsizing'' in cloud cost optimization?', 'Physically cutting a computer chassis to fit into a rack', 'Analyzing resource metrics to downsize over-provisioned or underutilized instances to smaller, cheaper instance types', 'Writing code with shorter variable names', 'Enforcing identical monitor resolutions across all developers', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (206, 11, 'What are Resource Tags in cloud management?', 'Physical barcode stickers affixed to datacenter doors', 'Key-value metadata assigned to cloud resources for cost allocation, ownership tracking, and automated governance', 'Graffiti spray-painted on server cases', 'HTML tags inside web page headers', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (207, 11, 'What does Power Usage Effectiveness (PUE) measure in datacenter sustainability?', 'The typing speed of datacenter engineers', 'The ratio of total facility power consumed to the power consumed strictly by the IT computing equipment', 'The voltage delivered by municipal electrical lines', 'The volume of diesel fuel stored in emergency tanks', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (208, 11, 'What is an ideal Power Usage Effectiveness (PUE) score representing 100% energy efficiency with zero cooling waste?', '0.0', '1.0', '10.0', '100.0', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (209, 11, 'What is a major environmental benefit of migrating from corporate on-premise data centers to hyperscale public clouds?', 'Public clouds use less total internet bandwidth', 'Hyperscalers achieve significantly higher server utilization and lower PUE, reducing enterprise computing carbon emissions by up to 80%', 'Public clouds produce zero physical heat', 'Servers never consume any electricity in the cloud', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (210, 11, 'What is a Service Control Policy (SCP) in AWS Organizations?', 'A policy that defines maximum allowed permissions for accounts in an organization, functioning as a non-bypassable guardrail', 'A document detailing customer support phone numbers', 'A script that turns on office air conditioners', 'An insurance policy against computer theft', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (211, 11, 'What is the primary benefit of a Multi-Account cloud architecture (e.g. separate accounts for Dev, Staging, and Production)?', 'Limiting the ''blast radius'' so an error or security compromise in Dev cannot impact Production', 'Getting free cloud accounts from sales teams', 'Making passwords shorter', 'Allowing everyone to share the same root password', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (212, 11, 'What is an orphaned or zombie cloud asset?', 'A server running video games about zombies', 'An unused cloud resource (e.g. unattached EBS volume, idle Elastic IP, obsolete snapshot) that continues accruing billing charges', 'A deleted user account', 'A broken fiber optic cable', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (213, 11, 'What is the difference between ''Chargeback'' and ''Showback'' in cloud accounting?', 'Chargeback actually bills internal departments for their cloud consumption; Showback merely provides visibility into costs without cross-charging budgets', 'Chargeback is illegal; Showback is legal', 'Chargeback only applies to credit cards; Showback applies to cash', 'There is no difference between the terms', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (214, 11, 'Why is scheduling development and staging servers to shut down automatically on nights and weekends a recommended FinOps practice?', 'It cools down server motherboards so they do not melt', 'Non-production environments are typically unused outside business hours; shutting them down for ~128 hours/week reduces compute costs by over 60%', 'It prevents hackers from working on weekends', 'Operating systems require 8 hours of sleep per day', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (215, 11, 'What is Data Sovereignty in the context of cloud ethics and compliance?', 'The principle that data is subject to the legal governance and regulatory privacy laws of the nation where it is physically located', 'The ownership of digital assets by internet service providers', 'A legal treaty allowing free public distribution of all corporate data', 'The conversion of text files into binary numbers', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (216, 11, 'Which native AWS service inspects your environment and provides real-time recommendations to optimize cost, security, fault tolerance, and performance?', 'AWS Trusted Advisor', 'AWS IAM', 'AWS CodeCommit', 'AWS Snowball', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (217, 11, 'What does the Philippine Data Privacy Act of 2012 (Republic Act No. 10173) mandate for cloud systems processing citizen data?', 'Mandates stringent protections for personal information, rights of data subjects, and compliance overseen by the National Privacy Commission (NPC)', 'Requires all servers to be located in presidential palaces', 'Bans all cloud computing across educational institutions', 'Requires paper duplicates of all digital emails', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (218, 11, 'What is an AWS Budget alarm?', 'A siren that sounds in the cloud datacenter', 'A custom threshold notification that alerts administrators when cloud spend or usage exceeds (or is forecasted to exceed) predefined financial limits', 'An automatic cancellation of all company bank accounts', 'A tool that deletes expensive virtual machines without warning', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (219, 11, 'In the FinOps framework, what does the ''Inform'' phase focus on?', 'Terminating random servers', 'Giving visibility, allocating costs accurately via tags, and providing transparent benchmarking to engineering and finance teams', 'Filing patent lawsuits against competitors', 'Calling customer service hotlines', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (220, 11, 'How does the practice of ''Green Computing'' impact software architecture decisions in the cloud?', 'It encourages efficient code algorithms, rightsized instances, and serverless architectures to minimize wasted electrical energy', 'It requires painting physical server racks with green eco-friendly paint', 'It forces all web pages to use green color schemes', 'It limits developers to writing no more than 10 lines of code per day', 'A');

-- Chapter 12: Emerging Trends and Future of Cloud Computing
INSERT INTO `chapters` (`chapter_id`, `course_id`, `chapter_number`, `module_title`, `chapter_title`, `summary_text`)
VALUES (12, 1, 12, 'Module 4: Advanced Topics', 'Emerging Trends and Future of Cloud Computing', '### The Next Frontier: Edge and Fog Computing
While centralized hyperscale clouds excel at massive analytical aggregation, modern latency-critical workloads (autonomous vehicles, robotic surgery, smart power grids, immersive AR/VR) cannot tolerate the 100-200ms round-trip latency to distant regional datacenters.
- **Edge Computing:** Pushes compute, storage, and analytics directly to the perimeter where data is generated (on factory floors, cellular towers, 5G base stations, connected vehicles).
- **Fog Computing:** The intermediate architectural layer between IoT edge sensors and the centralized cloud, facilitating localized protocol translation, stream filtering, and data reduction.
- **Hyperscale Edge Extensions:** Cloud providers now extend their native APIs directly to the edge using appliances like AWS Outposts, AWS Wavelength (embedded in 5G telco networks), Azure Stack Edge, and Google Distributed Cloud.

### Artificial Intelligence & MLOps in the Cloud
Cloud computing is the indispensable foundation for modern Artificial Intelligence and Foundation Models (LLMs):
- **Distributed Training:** Massive transformer models require parallelized clusters of thousands of high-interconnect GPUs/TPUs using specialized fabrics (e.g. NVIDIA InfiniBand, AWS EFA - Elastic Fabric Adapter).
- **MLOps (Machine Learning Operations):** Unifies data ingestion, feature stores, automated model training, hyperparameter tuning, model registries, and drift monitoring into continuous delivery pipelines (e.g. Kubeflow, AWS SageMaker Pipelines, Vertex AI).

### Quantum Cloud Computing
Quantum computing harnesses the strange properties of quantum mechanics to solve combinatorial problems that are intractable for classical binary supercomputers:
- **Qubits (Quantum Bits):** Unlike classical bits (0 or 1), qubits exploit **Superposition** (existing simultaneously in a linear combination of states) and **Entanglement** (interconnected states across qubits).
- **Cloud Quantum Access:** Cryogenic dilution refrigerators (-273.15°C) required to stabilize superconducting qubits are prohibitively complex to own on-premises. Platforms like **Amazon Braket**, **IBM Quantum Experience**, and **Azure Quantum** provide cloud-hosted access to diverse quantum processors (Superconducting, Trapped-Ion, Neutral Atom, Photonic).

### 5G Integration & Sustainable Hyper-Density
- **5G Network Slicing & MEC:** Cellular carriers dynamically carve isolated virtual end-to-end networks with guaranteed Ultra-Reliable Low-Latency Communication (URLLC < 1ms), directly terminating traffic into cloud micro-datacenters at 5G base stations.
- **Next-Gen Sustainability:** Experiments such as Microsoft Project Natick (submerged underwater datacenters powered by offshore wind with zero corrosion and freshwater cooling) and geothermal-powered arctic facilities point toward the climate-neutral future of global infrastructure.')
ON DUPLICATE KEY UPDATE `chapter_title`=VALUES(`chapter_title`);

INSERT INTO `quizzes` (`quiz_id`, `chapter_id`, `title`, `time_limit_minutes`, `passing_percentage`, `total_questions`)
VALUES (12, 12, 'Chapter 12 Assessment: Emerging Trends and Future of Cloud Computing', 10, 75, 20)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (221, 12, 'What is the primary driving motivation for adopting Edge Computing over centralized cloud computing?', 'To eliminate the need for computer monitors', 'To minimize network round-trip latency and bandwidth consumption by processing data near its generation source', 'Because edge computing is completely free of charge', 'To restrict internet access to local government officials', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (222, 12, 'In the distributed computing continuum, what is Fog Computing?', 'Computers operating in foggy weather conditions', 'An intermediate architecture layer bridging local edge devices with the centralized hyperscale cloud for pre-processing and aggregation', 'A computer virus that blurs screen pixels', 'A hardware cooling system that sprays water vapor into servers', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (223, 12, 'What AWS service places cloud compute and storage hardware directly inside telecommunications 5G network datacenters?', 'AWS Wavelength', 'AWS Snowball', 'Amazon S3 Glacier', 'AWS Elastic Beanstalk', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (224, 12, 'What is the quantum computing equivalent of a classical computer bit?', 'Byte', 'Qubit (Quantum Bit)', 'Transistor', 'Pixel', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (225, 12, 'What quantum mechanical property enables a qubit to exist in a linear combination of states (both 0 and 1 simultaneously)?', 'Superposition', 'Virtualization', 'Fragmentation', 'Thermal throttling', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (226, 12, 'What quantum phenomenon links pairs or groups of particles such that the state of one instantly dictates the state of another, regardless of distance?', 'Quantum Entanglement', 'Data Replication', 'Cache Invalidation', 'Packet Routing', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (227, 12, 'Why is quantum computing predominantly delivered as a cloud service (e.g. Amazon Braket, Azure Quantum, IBM Quantum)?', 'Quantum computers are illegal to own outside the cloud', 'Quantum processors require extreme cryogenic cooling near absolute zero (-273.15°C) and complex lab infrastructure impractical for on-premise deployments', 'Quantum algorithms only work on websites', 'Cloud providers own all quantum physics patents', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (228, 12, 'What is MLOps in cloud engineering?', 'Military Operations in the cloud', 'Machine Learning Operations — applying DevOps practices (CI/CD, versioning, monitoring) to automate ML model training and deployment pipelines', 'Manual typing of training datasets', 'A programming language used for robotics', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (229, 12, 'What is ''Model Drift'' in production machine learning systems?', 'A physical robot car losing tire traction', 'The degradation of an ML model''s prediction accuracy over time caused by changes in real-world data distributions', 'A computer monitor slowly turning black and white', 'A developer switching between different cloud platforms', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (230, 12, 'What 5G capability provides guaranteed ultra-reliable low latency communication (<1ms) for mission-critical industrial applications?', 'URLLC (Ultra-Reliable Low-Latency Communication)', 'eMBB (Enhanced Mobile Broadband)', 'SMS Text Messaging', 'MMS Multimedia', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (231, 12, 'What is 5G Network Slicing?', 'Physically cutting cellular fiber cables with scissors', 'Virtualizing a single physical 5G network into multiple isolated logical networks with customized QoS and latency guarantees', 'Limiting users to 10 minutes of phone calls per day', 'Slicing silicon wafers into microchips', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (232, 12, 'What was Microsoft Project Natick?', 'An underwater sealed datacenter research trial that proved submerged marine servers had an 8x lower failure rate', 'A flight simulator game built for Azure', 'A new search engine competing with Google', 'A satellite constellation launched into low Earth orbit', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (233, 12, 'What is Carbon-Aware Computing in modern cloud orchestration?', 'Writing software code with dark mode enabled', 'Dynamically scheduling or migrating computing workloads to cloud regions and times when renewable energy (solar, wind) is most abundant', 'Banning the use of carbon paper in offices', 'Using charcoal filters inside desktop computers', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (234, 12, 'Why is an autonomous vehicle reliant on Edge Computing rather than centralized cloud for emergency obstacle braking?', 'Cloud servers do not understand digital video', 'Network transmission latency over cellular links back to distant clouds is too slow to prevent high-speed collisions in real-time', 'Cars cannot connect to wireless radio frequencies', 'Centralized cloud providers forbid automotive applications', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (235, 12, 'What specialized network fabric do cloud hyperscalers use to connect thousands of GPUs for distributed AI training with microsecond latencies?', 'Dial-up telephone modems', 'NVIDIA InfiniBand / AWS Elastic Fabric Adapter (EFA)', 'Standard consumer Wi-Fi 4', 'Coaxial TV cables', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (236, 12, 'What is an AWS Outposts rack?', 'A camping tent for Amazon warehouse workers', 'A physical rack of AWS-designed hardware installed inside a customer''s on-premises data center, operated natively via the AWS console', 'A wooden server case used for vintage exhibitions', 'A mailbox for physical Amazon packages', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (237, 12, 'In cloud MLOps, what is a Feature Store?', 'A retail store that sells computer graphics cards', 'A centralized repository that stores, curates, and serves standardized machine learning features for training and real-time inference', 'A digital music store for smartphone ringtones', 'A database table that lists software bugs', 'B');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (238, 12, 'What cooling technique is replacing traditional air conditioning to support high-density 700W+ AI server racks?', 'Direct-to-chip liquid cooling and immersion liquid cooling', 'Ice cubes placed on top of server chassis', 'Opening windows in datacenter walls', 'Paper hand fans operated by staff', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (239, 12, 'What does Serverless Edge Computing (e.g. Cloudflare Workers, AWS Lambda@Edge) enable?', 'Executing lightweight code at hundreds of global CDN edge locations within 5 milliseconds of end users', 'Running Windows 98 on microwave ovens', 'Deleting all origin databases', 'Replacing all web servers with radio antennas', 'A');
INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`)
VALUES (240, 12, 'What is the defining mindset of a modern Cloud Solutions Architect?', 'Attempting to build and maintain everything on private physical hardware', 'Designing scalable, resilient, secure, cost-optimized, and sustainable distributed systems using automated cloud building blocks', 'Memorizing only command-line shortcuts without understanding architecture', 'Avoiding all software updates and security patches', 'B');

SET FOREIGN_KEY_CHECKS = 1;
