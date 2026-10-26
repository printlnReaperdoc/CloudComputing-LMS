// Module 2: Core Technologies
// Contains Chapters 5, 6, 7 with comprehensive slides, summaries, and 20 MCQs each.

module.exports = [
  {
    chapter_number: 5,
    module_title: "Module 2: Core Technologies",
    chapter_title: "Virtualization Fundamentals",
    objectives: [
      "Deconstruct the architecture and role of the Virtual Machine Monitor (Hypervisor).",
      "Contrast Type 1 (Bare-Metal) and Type 2 (Hosted) hypervisors with performance benchmarks.",
      "Analyze hardware-assisted CPU virtualization (Intel VT-x, AMD-V) and memory EPT/NPT.",
      "Evaluate Full Virtualization, Paravirtualization, and Live Migration mechanisms."
    ],
    summary_text: `### Foundations of Virtualization
Virtualization is the foundational technology enabling cloud computing by decoupling operating systems and applications from physical hardware. The core engine of virtualization is the **Hypervisor** (also known as the **Virtual Machine Monitor or VMM**), which multiplexes physical hardware resources (CPU, RAM, Storage, I/O) among multiple Guest Operating Systems running isolated Virtual Machines (VMs).

### Hypervisor Taxonomies
1. **Type 1 (Bare-Metal / Native):** Runs directly on the host's physical hardware without an underlying host operating system (e.g., VMware ESXi, KVM, Xen, Microsoft Hyper-V).
   - *Characteristics:* High efficiency, low overhead, enterprise-grade reliability, and direct driver access to hardware. Power all major hyperscale clouds.
2. **Type 2 (Hosted):** Runs as a user-space application on top of an existing host operating system (e.g., Oracle VM VirtualBox, VMware Workstation, Parallels Desktop).
   - *Characteristics:* Simpler installation and desktop testing utility, but incurs substantial overhead due to host OS context switching and double scheduling.

### Virtualization Techniques & Mechanisms
- **Full Virtualization:** The guest OS is completely unaware it is running in a virtual environment; hardware calls are trapped and emulated. Hardware-assisted CPU extensions (Intel VT-x, AMD-V) eliminate earlier binary translation penalties.
- **Paravirtualization:** The guest OS kernel is modified to make explicit hypercalls to the hypervisor using specialized drivers (e.g., Linux \`virtio\`), bypassing emulation and yielding near-native I/O throughput.
- **Live Migration (e.g. vMotion):** The ability to move an active, running virtual machine from one physical host to another with zero perceptible downtime, copying active RAM memory pages incrementally while the VM continues processing.`,
    slides: [
      {
        id: 1,
        title: "Virtualization Fundamentals",
        subtitle: "The Architectural Engine of the Modern Cloud",
        bullets: [
          "Virtualization abstracts physical computing hardware into modular virtual machines.",
          "Enables multi-tenancy, server consolidation, and dynamic elasticity.",
          "Transforms servers from fixed physical units into portable software files (VMDK, VHD, QCOW2).",
          "Governed by the Virtual Machine Monitor (Hypervisor)."
        ],
        diagram: `+-------------------------------------------------------+
|  VM 1 (Ubuntu)  |  VM 2 (Win Server)  |  VM 3 (RHEL)  |
+-------------------------------------------------------+
|                  HYPERVISOR (VMM)                     |
+-------------------------------------------------------+
|          PHYSICAL HARDWARE (CPU, RAM, DISK)           |
+-------------------------------------------------------+`,
        keyTakeaway: "Virtualization turned server hardware from a rigid physical appliance into programmable software abstraction.",
        notes: "Explain to students that without hypervisor virtualization, cloud providers could never achieve dynamic multi-tenant pooling."
      },
      {
        id: 2,
        title: "Type 1 vs. Type 2 Hypervisors",
        subtitle: "Bare-Metal vs. Hosted Architecture",
        bullets: [
          "Type 1 (Bare-Metal): Installed directly on raw physical server hardware.",
          "  • Zero host OS overhead; direct ring 0/root execution.",
          "  • Examples: VMware ESXi, Linux KVM, Xen, Microsoft Hyper-V.",
          "  • Used universally in enterprise datacenters and AWS/Azure/GCP clouds.",
          "Type 2 (Hosted): Installed as an application inside an existing host OS (Windows/macOS/Linux).",
          "  • Examples: Oracle VirtualBox, VMware Workstation.",
          "  • Used for local developer testing; unsuitable for production cloud."
        ],
        diagram: `Type 1 (Bare-Metal):                Type 2 (Hosted):
+-------------------------+         +-------------------------+
| Guest VMs               |         | Guest VMs               |
| HYPERVISOR (Bare-Metal) |         | HYPERVISOR (App)        |
| Physical Hardware       |         | Host Operating System   |
+-------------------------+         | Physical Hardware       |
                                    +-------------------------+`,
        keyTakeaway: "Production clouds rely exclusively on Type 1 hypervisors to maximize hardware throughput and eliminate OS abstraction penalties.",
        notes: "Note that Linux KVM turns the Linux kernel itself into a Type 1 hypervisor via the kvm.ko kernel module."
      },
      {
        id: 3,
        title: "CPU & Memory Virtualization",
        subtitle: "Hardware Assist, Rings, and Extended Page Tables",
        bullets: [
          "x86 Ring Architecture: Ring 0 (Kernel/Privileged) to Ring 3 (User Space).",
          "The 'Virtualization Gap': Certain sensitive x86 CPU instructions originally failed silently in unprivileged rings.",
          "Hardware-Assisted CPU Virtualization: Intel VT-x (VMX root/non-root modes) and AMD-V solved this at the silicon level.",
          "Memory Virtualization: Hypervisors map Guest Virtual Memory -> Guest Physical Memory -> Host Physical Memory.",
          "Hardware Extended Page Tables (EPT) and Nested Page Tables (NPT) eliminate CPU translation overhead."
        ],
        diagram: `Guest App  ---> [Guest Virtual Address]
Guest OS   ---> [Guest Physical Address] (via Page Table)
Hypervisor ---> [Host Physical RAM]      (via Hardware EPT/NPT)`,
        keyTakeaway: "Silicon hardware extensions from Intel and AMD made hypervisors run virtual machines at 98%+ of raw bare-metal speeds.",
        notes: "Highlight how Intel VT-x and AMD-V eliminated the complex binary translation techniques VMware had to write in the 1990s."
      },
      {
        id: 4,
        title: "Full Virtualization vs. Paravirtualization",
        subtitle: "Emulation vs. Hypercalls",
        bullets: [
          "Full Virtualization: The guest OS is unmodified and unaware it is in a VM. Hypervisor emulates all virtual hardware peripherals (NIC, IDE controllers).",
          "Paravirtualization: Guest OS is modified with paravirtualized drivers (e.g. Linux \`virtio\`).",
          "Instead of emulating hardware registers, the guest kernel makes direct software 'hypercalls' to the hypervisor.",
          "Drastically reduces disk and network I/O latency to near-native performance."
        ],
        diagram: `Full Virt:       Guest OS -> [Hardware Emulation Layer] -> Physical NIC
Paravirt:        Guest OS -> [virtio Hypercall]          -> Physical NIC`,
        keyTakeaway: "Paravirtualized drivers (virtio) are standard practice in cloud virtual machines to unlock maximum network and disk IOPS.",
        notes: "Mention that modern AWS Nitro systems take this further by offloading hypervisor tasks into specialized ASIC chips."
      },
      {
        id: 5,
        title: "Live Migration & High Availability",
        subtitle: "Moving Running Virtual Machines Across Physical Racks",
        bullets: [
          "Live Migration (e.g., VMware vMotion, KVM Live Migration): Moving an active, powered-on VM between physical hosts with zero downtime.",
          "Step 1: VM continues running on Host A while dirty memory pages are copied over high-speed networks to Host B.",
          "Step 2: Iterative pre-copy loops until remaining memory delta is minuscule.",
          "Step 3: Host A VM paused for milliseconds; final delta sent; Host B VM resumes instantly.",
          "Enables transparent host hardware maintenance, load balancing, and zero-downtime server upgrades."
        ],
        diagram: `Host A (Physical)                               Host B (Physical)
[Running VM] === High-Speed 10GbE Network ===> [Mirrored Memory Pages]
(Paused 15ms)  ------------------------------> (Resumes execution live!)`,
        keyTakeaway: "Live migration decoupled the software workload from physical rack maintenance, eliminating scheduled downtime.",
        notes: "Ask students: What happens to TCP network connections during live migration? (The hypervisor issues a gratuitous ARP broadcast to update network switches immediately)."
      },
      {
        id: 6,
        title: "Server Consolidation & VM Sprawl",
        subtitle: "Economic Benefits and Management Risks",
        bullets: [
          "Server Consolidation: Physical servers in enterprise datacenters historically ran at only 10-15% CPU utilization.",
          "Consolidation ratio: Packing 10 to 30 virtual machines onto a single beefy physical server increases utilization to 70-80%.",
          "Saves massive electricity, rack space, cooling, and hardware maintenance.",
          "VM Sprawl: Because VMs are so easy to spin up, administrators create hundreds of unused VMs that drain resources if ungoverned."
        ],
        diagram: `Before: 10 Physical Servers @ 10% CPU each (Huge electricity waste)
After:  1 Physical Server running 10 VMs @ 80% CPU (High efficiency)`,
        keyTakeaway: "Virtualization yields dramatic consolidation efficiencies, but requires automated lifecycle governance to curb VM sprawl.",
        notes: "Explain how automated tagging and expiration policies help control VM sprawl in production."
      },
      {
        id: 7,
        title: "Virtual Appliances & Disk Formats",
        subtitle: "Packaging Virtual Machines for Distribution",
        bullets: [
          "Virtual Machine Disk Formats: VMDK (VMware), VHD/VHDX (Microsoft), QCOW2 (QEMU/KVM), RAW.",
          "OVF (Open Virtualization Format) and OVA: Standardized archive packaging VM configuration + disk images.",
          "Cloud Image Formats: Amazon Machine Image (AMI), Azure Managed Image, Google Cloud Custom Image.",
          "Snapshotting: Point-in-time state capture enabling instant rollback before risky system updates."
        ],
        diagram: `[Virtual Appliance (.OVA)] = [VM Metadata (.OVF)] + [Compressed Disk (.VMDK)]`,
        keyTakeaway: "Virtual disks treat full operational computer drives as portable, snapshot-able single files.",
        notes: "Conclude Chapter 5. Preview Chapter 6: Cloud Storage and Data Management (Block vs File vs Object)."
      }
    ],
    quiz: {
      title: "Chapter 5 Assessment: Virtualization Fundamentals",
      time_limit_minutes: 10,
      passing_percentage: 75,
      questions: [
        {
          question_text: "What is another standard term for a Hypervisor?",
          option_a: "Virtual Machine Monitor (VMM)",
          option_b: "Dynamic Host Configuration Protocol (DHCP)",
          option_c: "Basic Input Output System (BIOS)",
          option_d: "Network Interface Card (NIC)",
          correct_option: "A",
          explanation: "Hypervisor and Virtual Machine Monitor (VMM) are synonymous terms for the software layer managing virtual machines."
        },
        {
          question_text: "What defines a Type 1 Hypervisor?",
          option_a: "It runs as an application inside an existing host desktop operating system",
          option_b: "It runs directly on the bare-metal physical hardware without an underlying host operating system",
          option_c: "It only works on smartphones and mobile devices",
          option_d: "It requires mechanical floppy disks to boot",
          correct_option: "B",
          explanation: "Type 1 (Bare-Metal) hypervisors install directly onto the physical server hardware, providing maximum performance and efficiency."
        },
        {
          question_text: "Which of the following is an example of a Type 1 (Bare-Metal) Hypervisor?",
          option_a: "Oracle VM VirtualBox",
          option_b: "VMware Workstation",
          option_c: "VMware ESXi",
          option_d: "Microsoft Word",
          correct_option: "C",
          explanation: "VMware ESXi is an enterprise-grade Type 1 bare-metal hypervisor installed directly onto physical servers."
        },
        {
          question_text: "Which of the following is an example of a Type 2 (Hosted) Hypervisor?",
          option_a: "Oracle VM VirtualBox",
          option_b: "Linux KVM bare-metal",
          option_c: "Citrix Hypervisor / XenServer",
          option_d: "AWS Nitro Card",
          correct_option: "A",
          explanation: "Oracle VirtualBox runs as an application inside a host operating system (Windows/macOS/Linux), making it a Type 2 hypervisor."
        },
        {
          question_text: "What hardware extensions did Intel and AMD introduce to accelerate CPU virtualization?",
          option_a: "DirectX and OpenGL",
          option_b: "Intel VT-x and AMD-V",
          option_c: "PCI-Express and USB 3.0",
          option_d: "RGB LED controllers",
          correct_option: "B",
          explanation: "Intel VT-x and AMD-V provide silicon-level instruction set extensions enabling hypervisors to run guest OS kernels securely and swiftly."
        },
        {
          question_text: "In Paravirtualization, how does the guest operating system interact with the hypervisor?",
          option_a: "It does not know it is virtualized and emulates old hardware devices",
          option_b: "It is modified with specialized drivers (e.g. virtio) to make direct 'hypercalls' to the hypervisor",
          option_c: "It bypasses the hypervisor and takes exclusive physical ownership of the CPU",
          option_d: "It sends analog audio beeps to the motherboard speaker",
          correct_option: "B",
          explanation: "Paravirtualization modifies the guest OS kernel with enlightened drivers (virtio) that make hypercalls directly to the hypervisor."
        },
        {
          question_text: "What is 'Live Migration' (such as VMware vMotion or KVM live migration)?",
          option_a: "Migrating an employee from one office desk to another",
          option_b: "Moving an active, running virtual machine from one physical server to another with zero perceptible downtime",
          option_c: "Powering off a server, unplugging the hard drive, and physically carrying it to a new room",
          option_d: "Translating code from Python to Java",
          correct_option: "B",
          explanation: "Live migration transfers the active execution memory state of a running VM across physical hosts without interrupting service."
        },
        {
          question_text: "What is 'Server Consolidation'?",
          option_a: "Combining multiple underutilized physical servers into virtual machines on a single powerful physical host",
          option_b: "Physically soldering two servers together in a server rack",
          option_c: "Deleting 50% of an organization's databases to save space",
          option_d: "Restricting all employees to using only one email account",
          correct_option: "A",
          explanation: "Server consolidation replaces dozens of underutilized physical servers with VMs on high-density physical hardware, saving power and space."
        },
        {
          question_text: "What phenomenon is known as 'VM Sprawl'?",
          option_a: "Virtual machines physically expanding in size inside a datacenter rack",
          option_b: "The proliferation of unmanaged, forgotten, or abandoned virtual machines consuming cluster computing resources",
          option_c: "An error where a virtual machine fails to allocate an IP address",
          option_d: "A computer virus that infects hypervisors",
          correct_option: "B",
          explanation: "VM sprawl occurs when virtual machines are spun up easily but never decommissioned, draining compute and storage resources."
        },
        {
          question_text: "What is the function of Extended Page Tables (EPT) or Nested Page Tables (NPT) in modern processors?",
          option_a: "Hardware-assisted translation from guest physical memory to host physical memory to eliminate memory virtualization overhead",
          option_b: "Allowing web browsers to open infinite tabs",
          option_c: "Printing book pages at double speed",
          option_d: "Formatting hard drives with FAT32 filesystems",
          correct_option: "A",
          explanation: "EPT (Intel) and NPT (AMD) are hardware memory management unit (MMU) features that accelerate virtual-to-physical memory address translation."
        },
        {
          question_text: "Which file format is standard for QEMU/KVM virtual disk images with copy-on-write capabilities?",
          option_a: ".MP3",
          option_b: ".QCOW2",
          option_c: ".DOCX",
          option_d: ".EXE",
          correct_option: "B",
          explanation: "QCOW2 (QEMU Copy-On-Write 2) is the primary virtual disk format for KVM, supporting thin provisioning, compression, and snapshots."
        },
        {
          question_text: "What is a Virtual Machine Snapshot?",
          option_a: "A photograph taken of the physical datacenter room",
          option_b: "A point-in-time copy of a virtual machine's disk state and memory, allowing instant rollback in case of error",
          option_c: "A screenshot of the desktop background wallpaper",
          option_d: "An audio recording of the server fan spinning",
          correct_option: "B",
          explanation: "A snapshot captures the exact state and data of a virtual machine at a specific instant, providing a rapid rollback mechanism."
        },
        {
          question_text: "Why are Type 2 Hypervisors generally unsuitable for enterprise cloud production environments?",
          option_a: "They cannot run on Intel chips",
          option_b: "They introduce severe performance overhead by running on top of an unnecessary host operating system layer",
          option_c: "They only work when disconnected from the internet",
          option_d: "They do not support keyboard inputs",
          correct_option: "B",
          explanation: "Type 2 hypervisors incur double context switches and OS scheduling overhead because they run inside a general-purpose host OS."
        },
        {
          question_text: "In x86 computer architecture, which ring level possesses the highest hardware privileges for kernel operations?",
          option_a: "Ring 3",
          option_b: "Ring 2",
          option_c: "Ring 1",
          option_d: "Ring 0",
          correct_option: "D",
          explanation: "Ring 0 is the most privileged execution level on x86 processors, reserved for operating system kernels and bare-metal hypervisors."
        },
        {
          question_text: "What is an AMI in the context of Amazon Web Services?",
          option_a: "Amazon Machine Image — a pre-configured template containing the OS, software, and configuration to launch an EC2 instance",
          option_b: "Automated Management Interface",
          option_c: "Advanced Motherboard Interconnect",
          option_d: "Analog Modem Identification",
          correct_option: "A",
          explanation: "An AMI (Amazon Machine Image) is a packaged virtual machine template that includes the OS, application server, and default configurations."
        },
        {
          question_text: "What network action occurs during the final phase of a Live VM Migration so switches route traffic to the new host?",
          option_a: "A reboot of all physical routers in the building",
          option_b: "The new host broadcasts a Gratuitous ARP (GARP) packet to update the network switches' MAC address forwarding tables",
          option_c: "The user must manually type a new IP address into their browser",
          option_d: "The network cable must be manually unplugged and re-plugged",
          correct_option: "B",
          explanation: "A Gratuitous ARP broadcast updates the Layer 2 switch forwarding tables immediately to associate the VM's MAC address with the new physical port."
        },
        {
          question_text: "What does 'Thin Provisioning' mean for a virtual disk?",
          option_a: "The disk only consumes physical storage space as data is actually written to it, rather than allocating all capacity upfront",
          option_b: "The hard drive is physically made of ultra-thin aluminum foil",
          option_c: "Only thin clients can read data from the disk",
          option_d: "The disk automatically deletes files after 7 days",
          correct_option: "A",
          explanation: "Thin provisioning allocates storage space on-demand as blocks are written, optimizing physical disk capacity across virtual machines."
        },
        {
          question_text: "Which hypervisor technology is integrated directly into the core Linux kernel?",
          option_a: "KVM (Kernel-based Virtual Machine)",
          option_b: "VirtualBox",
          option_c: "VMware Workstation",
          option_d: "Parallels Desktop",
          correct_option: "A",
          explanation: "KVM (Kernel-based Virtual Machine) is built directly into the mainline Linux kernel, converting Linux into a Type 1 bare-metal hypervisor."
        },
        {
          question_text: "What is the primary benefit of Open Virtualization Format (OVF)?",
          option_a: "It allows open-source games to run faster",
          option_b: "It provides an open, vendor-neutral standard for packaging and distributing virtual appliances across different hypervisors",
          option_c: "It makes physical computer cases transparent",
          option_d: "It encrypts video streaming services",
          correct_option: "B",
          explanation: "OVF is a platform-independent packaging format that allows virtual appliances to be imported across VMware, VirtualBox, KVM, and Xen."
        },
        {
          question_text: "How does AWS Nitro architecture modernize traditional hypervisor virtualization?",
          option_a: "By eliminating all virtual machines and returning to physical mainframes",
          option_b: "By offloading virtualization tasks (networking, EBS storage, security) to dedicated hardware ASIC cards, freeing almost 100% of host CPU/RAM for guest VMs",
          option_c: "By running the entire AWS cloud on smartphones",
          option_d: "By using liquid nitrogen to cool individual processors",
          correct_option: "B",
          explanation: "AWS Nitro offloads hypervisor overhead (storage I/O, VPC networking, security) onto dedicated PCIe Nitro cards, yielding near-pure bare metal performance."
        }
      ]
    }
  },
  {
    chapter_number: 6,
    module_title: "Module 2: Core Technologies",
    chapter_title: "Cloud Storage and Data Management",
    objectives: [
      "Compare and contrast the three fundamental cloud storage paradigms: Block, File, and Object Storage.",
      "Analyze the trade-offs of the CAP Theorem and PACELC theorem in distributed cloud data stores.",
      "Evaluate Eventual Consistency vs. Strong Consistency models across hyperscale platforms.",
      "Design tiered storage lifecycle policies and cold data archiving architectures."
    ],
    summary_text: `### The Three Pillars of Cloud Storage
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
Cloud storage provides automated lifecycle management: transitioning frequently accessed data from Standard S3 tiers to Infrequent Access (S3-IA), and archiving cold compliance logs to ultra-low-cost tape/cold storage (AWS S3 Glacier Flexible / Glacier Deep Archive), cutting costs by up to 95%.`,
    slides: [
      {
        id: 1,
        title: "Cloud Storage and Data Management",
        subtitle: "Block, File, Object Storage, and Distributed Consistency",
        bullets: [
          "Storage is the lifeblood of cloud applications and data pipelines.",
          "Choice of storage directly dictates application throughput, latency, and costs.",
          "Three core storage pillars: Block Storage, File Storage, and Object Storage.",
          "Distributed data governed by CAP theorem and consistency models."
        ],
        diagram: `+-------------------------------------------------------------+
|                  THE 3 CLOUD STORAGE PILLARS                |
+-------------------------------------------------------------+
|  [ Block Storage ]   |  [ File Storage ]   | [ Object Storage ]
|  - AWS EBS / Disk    |  - AWS EFS / Azure  | - Amazon S3 / Blob
|  - Raw virtual disk  |  - Shared NFS/SMB   | - Flat namespace  
|  - OS & Databases    |  - Multi-VM mount   | - Media, Backups  
+-------------------------------------------------------------+`,
        keyTakeaway: "Match the workload to the right storage architecture: Block for OS/DBs, File for shared directories, Object for limitless media/backups.",
        notes: "Help students realize that Object Storage is accessed via REST APIs (GET/PUT), not mounted as a drive letter like Block storage."
      },
      {
        id: 2,
        title: "Block Storage Deep Dive",
        subtitle: "AWS EBS, NVMe, and Low-Latency Virtual Disks",
        bullets: [
          "Organizes data into fixed-size raw blocks; formatted with filesystems (ext4, XFS, NTFS).",
          "Attached to a single VM instance within the same Availability Zone.",
          "Provides high IOPS (Input/Output Operations Per Second) and sub-millisecond latencies.",
          "Volume types: General Purpose SSD (gp3), Provisioned IOPS SSD (io2 Block Express), Throughput Optimized HDD.",
          "Snapshots are incremental and saved automatically to resilient object storage."
        ],
        diagram: `[Virtual Machine] === Dedicated SAN/NVMe Link ===> [Block Volume (EBS)]
                                                    (Formatted as ext4 / NTFS)`,
        keyTakeaway: "Block storage behaves like a physical hard drive dedicated to a specific virtual machine.",
        notes: "Discuss IOPS vs. Throughput: Transactional databases need high IOPS; video streaming needs high throughput."
      },
      {
        id: 3,
        title: "File Storage (Network Attached)",
        subtitle: "AWS EFS, Azure Files, NFS, and Shared Filesystems",
        bullets: [
          "Hierarchical directory tree structure (directories, subdirectories, and files).",
          "Supports concurrent multi-instance read and write access across hundreds of VMs.",
          "Protocols: Network File System (NFSv4) for Linux; Server Message Block (SMB) for Windows.",
          "Automatically grows and shrinks elastically as files are added or deleted; zero pre-provisioning.",
          "Use cases: Web content management (WordPress wp-content), machine learning training sets, shared developer home dirs."
        ],
        diagram: `[VM Instance 1] --+
[VM Instance 2] ---+---> [Shared File System (EFS)] ---> (Hierarchical Tree: /var/www)
[VM Instance 3] --+`,
        keyTakeaway: "File storage allows dozens or hundreds of distributed instances to read and write to the same shared directory simultaneously.",
        notes: "Contrast EFS with EBS: EBS connects to one VM at a time; EFS connects to hundreds concurrently."
      },
      {
        id: 4,
        title: "Object Storage (Hyperscale)",
        subtitle: "Amazon S3, Azure Blob, Flat Namespaces & HTTP APIs",
        bullets: [
          "Data stored as unique objects in a flat namespace called a 'Bucket' (no nested directory folders).",
          "Each object contains: Key (Name), Value (Data Payload), Metadata (Tags, Content-Type), and Access Control.",
          "Accessed globally via HTTPS REST API verbs: \`GET\`, \`PUT\`, \`DELETE\`, \`HEAD\`.",
          "Unprecedented durability: 99.999999999% (11 nines) achieved by replicating data across minimum 3 physical datacenters.",
          "Virtually limitless capacity; individual objects can scale up to 5 Terabytes."
        ],
        diagram: `Object Anatomy:
  +-----------------------------------------------------------+
  | Key: "users/photos/101.jpg"                               |
  | Metadata: { "content-type": "image/jpeg", "author": "dev"}|
  | Payload:  [ Binary Image Bytes (up to 5 TB) ]             |
  +-----------------------------------------------------------+`,
        keyTakeaway: "Object storage is the foundation of modern data lakes, web media delivery, and compliance archiving.",
        notes: "Explain 11 nines durability: If you store 10,000,000 objects in S3, you can expect to lose a single object once every 10,000 years."
      },
      {
        id: 5,
        title: "The CAP Theorem in Distributed Systems",
        subtitle: "Consistency, Availability, and Partition Tolerance",
        bullets: [
          "Distributed networks will inevitably experience network partitions (P) due to dropped packets or severed cables.",
          "When a partition occurs, an architect MUST choose between:",
          "  • Consistency (CP): Return an error or timeout rather than serving stale data.",
          "  • Availability (AP): Return the most recent available data, even if it is stale due to replication lag.",
          "No distributed system can guarantee Consistency and Availability simultaneously across a network partition."
        ],
        diagram: `                  [ PARTITION TOLERANCE (P) ]
                             /                    \\
                            /                      \\
                           /                        \\
             [ CONSISTENCY (C) ] ------------ [ AVAILABILITY (A) ]
                  (CP Systems)                     (AP Systems)
             (MongoDB, RDBMS, HBase)          (DynamoDB, Cassandra, DNS)`,
        keyTakeaway: "In distributed cloud data architecture, you cannot choose CA; you must decide how your system behaves during network partitions.",
        notes: "Use the ATM example: If an ATM loses network connection to headquarters, does it dispense cash (AP) or display an error (CP)?"
      },
      {
        id: 6,
        title: "Consistency Models: Strong vs. Eventual",
        subtitle: "Data Synchronization in Hyperscale Systems",
        bullets: [
          "Strong Consistency: Immediate read-after-write consistency; any client reading immediately sees the newest write.",
          "  • Cost: Higher write latency due to synchronous quorum confirmation across nodes.",
          "Eventual Consistency: Writes propagate asynchronously to replica nodes over time.",
          "  • Advantage: Extremely fast writes and high availability.",
          "  • Behavior: Reads immediately following a write might temporarily return stale data, but all replicas eventually converge.",
          "Amazon S3 upgraded to strong read-after-write consistency for PUTs and DELETEs in late 2020."
        ],
        diagram: `Strong:   Client Write -> [Sync Node 1] && [Sync Node 2] -> Write Confirmed
Eventual: Client Write -> [Sync Node 1] -> Confirmed! ---> [Async Node 2 later]`,
        keyTakeaway: "Financial balances demand Strong Consistency; social media like counts and user avatars thrive on Eventual Consistency.",
        notes: "Discuss PACELC theorem as the modern extension: If Partition: choose A or C; Else: choose Latency (L) or Consistency (C)."
      },
      {
        id: 7,
        title: "Storage Lifecycle Management & Archiving",
        subtitle: "Automated Cost Optimization across Storage Tiers",
        bullets: [
          "S3 Standard: Frequently accessed data; active web assets.",
          "S3 Standard-IA (Infrequent Access): Lower storage cost, small per-GB retrieval fee. For 30+ day old data.",
          "S3 One Zone-IA: Lower cost for non-critical reproducible data stored in a single AZ.",
          "S3 Glacier Flexible: Cold backup archives; retrieval times from minutes to hours.",
          "S3 Glacier Deep Archive: Lowest cost storage ($0.00099/GB/mo); 12-hour retrieval for compliance records.",
          "Lifecycle Rules: Automatically transition objects (e.g. 30 days -> IA, 90 days -> Glacier, 365 days -> Delete)."
        ],
        diagram: `[Day 1: S3 Standard] ---> [Day 30: S3-IA] ---> [Day 90: Glacier Deep Archive] ---> [Day 365: Expire]
       ($0.023/GB)              ($0.0125/GB)               ($0.00099/GB - 95% savings!)`,
        keyTakeaway: "Automated storage lifecycle rules slash enterprise cloud bills by continuously migrating cold data to cheaper archiving tiers.",
        notes: "Conclude Chapter 6. Up next: Chapter 7 Cloud Networking (VPCs, Subnets, Gateways, and Firewalls)."
      }
    ],
    quiz: {
      title: "Chapter 6 Assessment: Cloud Storage and Data Management",
      time_limit_minutes: 10,
      passing_percentage: 75,
      questions: [
        {
          question_text: "Which cloud storage type functions like an unformatted physical raw hard drive attached to a virtual machine?",
          option_a: "Object Storage",
          option_b: "Block Storage",
          option_c: "File Storage",
          option_d: "Cold Archival Storage",
          correct_option: "B",
          explanation: "Block storage (e.g. AWS EBS) provides raw storage blocks that can be formatted with any filesystem (ext4, NTFS) for OS and DB use."
        },
        {
          question_text: "Which of the following is the premier example of an Object Storage service?",
          option_a: "AWS Elastic File System (EFS)",
          option_b: "Amazon Elastic Block Store (EBS)",
          option_c: "Amazon Simple Storage Service (Amazon S3)",
          option_d: "Linux SWAP partition",
          correct_option: "C",
          explanation: "Amazon S3 is the industry benchmark for hyperscale object storage, storing data as discrete objects in buckets over HTTP APIs."
        },
        {
          question_text: "What network protocols are typically used to mount cloud File Storage across multiple virtual machines?",
          option_a: "NFS (Network File System) and SMB (Server Message Block)",
          option_b: "SMTP and POP3",
          option_c: "BGP and OSPF",
          option_d: "SSH and Telnet",
          correct_option: "A",
          explanation: "Cloud file storage services (e.g. AWS EFS, Azure Files) utilize standard NFS (Linux) and SMB/CIFS (Windows) protocols."
        },
        {
          question_text: "How much durability is Amazon S3 Standard designed to provide for stored objects?",
          option_a: "90.0%",
          option_b: "99.0%",
          option_c: "99.999999999% (11 nines)",
          option_d: "100.0% with zero hardware failures forever",
          correct_option: "C",
          explanation: "Amazon S3 Standard is engineered for 99.999999999% (11 nines) of annual data durability by redundantly storing objects across multiple AZs."
        },
        {
          question_text: "What is the maximum file size for a single object in Amazon S3?",
          option_a: "5 Gigabytes",
          option_b: "500 Megabytes",
          option_c: "5 Terabytes",
          option_d: "Unlimited single object size",
          correct_option: "C",
          explanation: "Individual objects in Amazon S3 can range from 0 bytes up to a maximum of 5 Terabytes (uploaded via multipart upload for >5GB)."
        },
        {
          question_text: "What does the CAP Theorem state regarding distributed data systems?",
          option_a: "All cloud computers are permanently secure",
          option_b: "A distributed system can guarantee at most two out of Consistency, Availability, and Partition Tolerance simultaneously",
          option_c: "Storage capacity doubles every 18 months",
          option_d: "Every database must run on MySQL",
          correct_option: "B",
          explanation: "Eric Brewer's CAP Theorem proves a distributed system cannot achieve Consistency, Availability, and Partition Tolerance all at once."
        },
        {
          question_text: "Because network partitions (P) are physically inevitable in distributed networks, what fundamental architectural trade-off must designers make?",
          option_a: "Choosing between CP (Consistency over Availability) or AP (Availability over Consistency)",
          option_b: "Choosing between Windows or macOS",
          option_c: "Choosing between keyboards or mice",
          option_d: "Choosing between electricity or solar power",
          correct_option: "A",
          explanation: "When network communication between nodes breaks, systems must decide whether to stop writes to ensure consistency (CP) or keep running with potential stale data (AP)."
        },
        {
          question_text: "In an Eventual Consistency model, what happens immediately after a write operation?",
          option_a: "The entire database crashes and restarts",
          option_b: "A read request immediately following the write might temporarily return stale data until all replicas synchronize",
          option_c: "All other users are logged out permanently",
          option_d: "The write is rejected and deleted",
          correct_option: "B",
          explanation: "Eventual consistency allows asynchronous replication; reads immediately following a write may return stale data until replicas catch up."
        },
        {
          question_text: "Which storage service is specifically optimized for cold archiving compliance records with retrieval times of 3 to 5 hours or 12 hours at lowest cost?",
          option_a: "Amazon S3 Glacier / S3 Glacier Deep Archive",
          option_b: "AWS EBS Provisioned IOPS",
          option_c: "RAM cache",
          option_d: "Local NVMe instance store",
          correct_option: "A",
          explanation: "S3 Glacier and Glacier Deep Archive provide ultra-low-cost cold storage designed for long-term data retention with delayed retrieval."
        },
        {
          question_text: "What is an S3 Lifecycle Rule?",
          option_a: "A policy that automatically transitions objects between storage tiers or deletes them based on age",
          option_b: "A biological law governing the lifespan of servers",
          option_c: "A warranty contract for datacenter cooling fans",
          option_d: "A rule requiring users to change passwords every 30 days",
          correct_option: "A",
          explanation: "Lifecycle configuration rules automate data migration (e.g. from Standard to Infrequent Access to Glacier) and expiration based on age."
        },
        {
          question_text: "Why is Block Storage (EBS) preferred over Object Storage (S3) for running relational database engines like MySQL or PostgreSQL?",
          option_a: "Object storage is too expensive for text files",
          option_b: "Databases require low-latency random read/write I/O operations and filesystem-level file locking that object storage does not support",
          option_c: "MySQL does not run on Linux",
          option_d: "Block storage does not require any passwords",
          correct_option: "B",
          explanation: "Relational databases modify discrete 8KB/16KB page blocks randomly on disk; S3 requires rewriting the entire object on every change."
        },
        {
          question_text: "How do clients interact with and retrieve files from Object Storage?",
          option_a: "Via standard HTTP/HTTPS REST API requests (e.g., GET, PUT, DELETE) using URLs",
          option_b: "Using a physical SATA ribbon cable",
          option_c: "By inserting a USB thumb drive into the cloud server",
          option_d: "Through a BIOS setup menu",
          correct_option: "A",
          explanation: "Object storage is accessed via standard web protocols (HTTP/HTTPS) using RESTful endpoints and unique object URLs."
        },
        {
          question_text: "What is the primary difference between AWS EBS and AWS EFS?",
          option_a: "EBS is block storage attached to a single VM; EFS is shared file storage that can be mounted simultaneously by hundreds of VMs",
          option_b: "EBS is free; EFS costs $10,000 per month",
          option_c: "EBS is for Windows only; EFS is for Android phones only",
          option_d: "EBS does not support encryption",
          correct_option: "A",
          explanation: "EBS attaches as a block device to one EC2 instance at a time, whereas EFS is a distributed NFS file system mounted by hundreds of instances concurrently."
        },
        {
          question_text: "What is IOPS in storage performance benchmarking?",
          option_a: "Input/Output Operations Per Second — measuring how many read/write operations a storage drive can perform each second",
          option_b: "Internet Online Protocol Standard",
          option_c: "Internal Operating Power Supply",
          option_d: "Integrated Optical Processing Speed",
          correct_option: "A",
          explanation: "IOPS measures the number of discrete read or write operations a storage volume can process per second, critical for database responsiveness."
        },
        {
          question_text: "What is 'Instance Store' (ephemeral storage) on AWS EC2?",
          option_a: "Temporary block-level storage physically attached to the host server that is wiped and lost if the instance stops or terminates",
          option_b: "Permanent storage backed up to magnetic tape",
          option_c: "A retail store that sells cloud merchandise",
          option_d: "A database table that stores user passwords",
          correct_option: "A",
          explanation: "Instance Store provides ultra-high-speed temporary scratch storage physically located on the host server, but data is lost when the instance is stopped."
        },
        {
          question_text: "Which of the following is considered 'Unstructured Data' ideally suited for cloud object storage?",
          option_a: "High-resolution video files, audio recordings, and medical imaging DICOM files",
          option_b: "A strict 10-column relational SQL table of bank accounts",
          option_c: "A CSV spreadsheet containing employee ID numbers",
          option_d: "A primary key index file in Oracle DB",
          correct_option: "A",
          explanation: "Unstructured data refers to rich media files, PDFs, videos, and images that lack a rigid tabular schema, making them ideal for object storage."
        },
        {
          question_text: "What is the PACELC theorem an extension of?",
          option_a: "Moore's Law",
          option_b: "The CAP Theorem — adding Latency (L) vs Consistency (C) trade-offs during normal operating conditions (Else - E)",
          option_c: "Newton's Third Law of Motion",
          option_d: "Amdahl's Law of Parallel Computing",
          correct_option: "B",
          explanation: "Daniel Abadi's PACELC theorem extends CAP: if Partition (P), choose Availability (A) or Consistency (C); Else (E), choose Latency (L) or Consistency (C)."
        },
        {
          question_text: "What does S3 Object Versioning protect against?",
          option_a: "High electricity bills",
          option_b: "Accidental deletions and unintended overwrites by retaining historical versions of every object",
          option_c: "Server motherboards catching fire",
          option_d: "Slow internet speeds",
          correct_option: "B",
          explanation: "S3 Versioning preserves multiple versions of an object in the same bucket, allowing quick recovery from unintended overwrites or deletions."
        },
        {
          question_text: "What is the purpose of S3 Pre-Signed URLs?",
          option_a: "Allowing users temporary secure access to download or upload a specific private S3 object without granting them AWS credentials",
          option_b: "Signing an electronic lease for datacenter property",
          option_c: "Registering a domain name with ICANN",
          option_d: "Translating URLs into physical street addresses",
          correct_option: "A",
          explanation: "Pre-signed URLs grant time-limited cryptographic permissions to upload or download a private S3 object directly from the client."
        },
        {
          question_text: "In distributed database replication, what is a 'Split-Brain' scenario?",
          option_a: "When a programmer forgets how their code works",
          option_b: "When a network partition causes two isolated clusters of nodes to both believe they are the active primary, accepting conflicting writes",
          option_c: "When a processor chip cracks physically in half",
          option_d: "When an operating system runs two web browsers at the same time",
          correct_option: "B",
          explanation: "Split-brain occurs when network partition isolates nodes, causing multiple subsets to elect new leaders independently, generating data divergence."
        }
      ]
    }
  },
  {
    chapter_number: 7,
    module_title: "Module 2: Core Technologies",
    chapter_title: "Cloud Networking",
    objectives: [
      "Architect isolated cloud network topologies using Virtual Private Clouds (VPCs) and Subnets.",
      "Calculate and configure Classless Inter-Domain Routing (CIDR) IPv4 address blocks.",
      "Evaluate routing components: Internet Gateways, NAT Gateways, and Route Tables.",
      "Contrast stateful Security Groups against stateless Network Access Control Lists (NACLs)."
    ],
    summary_text: `### Virtual Private Cloud (VPC) Architecture
A Virtual Private Cloud (VPC) is a logically isolated virtual network dedicated to a cloud customer's account, closely mirroring a traditional on-premises data center network with the benefits of cloud scalability.

### Subnetting & CIDR Notation
- **CIDR (Classless Inter-Domain Routing):** Defines IP address ranges using prefix notation (\`IP/prefix\`). The prefix designates the number of fixed network bits:
  - \`10.0.0.0/16\` provides $2^{(32-16)} = 65,536$ total IP addresses.
  - \`10.0.1.0/24\` provides $2^{(32-24)} = 256$ IP addresses (AWS reserves 5 addresses per subnet, leaving 251 usable).
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
- **Application Load Balancer (ALB):** Layer 7 (HTTP/HTTPS) intelligent routing based on URL paths (\`/api\` vs \`/images\`), host headers, and HTTP methods.
- **Network Load Balancer (NLB):** Layer 4 (TCP/UDP) ultra-high performance handling millions of requests per second with volatile traffic patterns and static IP allocation.
- **Content Delivery Network (CDN - e.g. Amazon CloudFront):** Caches static assets (images, CSS, JS) at hundreds of global Point of Presence (PoP) edge locations to slash latency.`,
    slides: [
      {
        id: 1,
        title: "Cloud Networking",
        subtitle: "VPCs, Subnets, Routing, and Perimeter Defense",
        bullets: [
          "Networking connects distributed compute, storage, and external clients.",
          "Software-Defined Networking (SDN) replaces physical switches and patch cables.",
          "Core isolation construct: Virtual Private Cloud (VPC).",
          "Layered security: Security Groups, NACLs, Gateways, and Load Balancers."
        ],
        diagram: `+-------------------------------------------------------------+
|               VIRTUAL PRIVATE CLOUD (VPC: 10.0.0.0/16)      |
|  +---------------------------+   +-----------------------+  |
|  | Public Subnet (10.0.1.0/24)|  | Private Subnet (10.0.2)|  |
|  | [ Internet Gateway ]      |  | [ NAT Gateway ]       |  |
|  | [ Public Load Balancer ]  |  | [ Database Cluster ]  |  |
|  +---------------------------+   +-----------------------+  |
+-------------------------------------------------------------+`,
        keyTakeaway: "Software-Defined Networking enables instantaneous, programmatic creation of complex enterprise network topologies.",
        notes: "Emphasize to students that in the cloud, networking is defined in software code (IaC) rather than physical cables."
      },
      {
        id: 2,
        title: "VPC & Subnet Topologies",
        subtitle: "Classless Inter-Domain Routing (CIDR) and Segmentation",
        bullets: [
          "VPC spans all Availability Zones within a chosen cloud Region.",
          "Subnets reside strictly within a single Availability Zone.",
          "CIDR Math: Subnet mask defines network size. /16 = 65,536 IPs; /24 = 256 IPs.",
          "Cloud Provider IP Reservations: AWS reserves 5 IP addresses in every subnet (Network, VPC Router, DNS, Future Use, Broadcast).",
          "A /24 subnet has 256 - 5 = 251 usable host IP addresses."
        ],
        diagram: `CIDR Breakdown:
  10.0.0.0/16  ---> Entire VPC (65,536 addresses)
    ├── 10.0.1.0/24 (AZ-a Public Web:   251 usable)
    ├── 10.0.2.0/24 (AZ-b Public Web:   251 usable)
    ├── 10.0.10.0/24 (AZ-a Private DB:  251 usable)
    └── 10.0.20.0/24 (AZ-b Private DB:  251 usable)`,
        keyTakeaway: "Plan your VPC CIDR blocks generously at the start; altering VPC CIDRs in production is difficult.",
        notes: "Remind students not to use overlapping CIDR blocks if they plan to connect VPCs via VPC Peering or Direct Connect."
      },
      {
        id: 3,
        title: "Gateways: Internet vs. NAT Gateway",
        subtitle: "Controlling Ingress and Egress Network Traffic",
        bullets: [
          "Internet Gateway (IGW): Horizontally scaled, highly available VPC component enabling communication between public subnets and the internet.",
          "NAT Gateway (Network Address Translation):",
          "  • Deployed inside a PUBLIC subnet with an Elastic IP.",
          "  • Allows instances in PRIVATE subnets to make outbound requests to the internet (e.g. software patches).",
          "  • Blocks external internet clients from initiating incoming connections to the private instances."
        ],
        diagram: `[Private Subnet (DB)] ---> [NAT Gateway (Public)] ---> [Internet Gateway] ---> [Internet]
(Outbound allowed)          (Rewrites Source IP)        (Routes to WWW)
(Inbound blocked!) <X------ (Direct inbound dropped) <------------------------- [Attacker]`,
        keyTakeaway: "NAT Gateways provide one-way outbound connectivity, protecting backend databases from direct internet exposure.",
        notes: "Explain that NAT Gateways incur hourly charges plus per-GB data processing fees."
      },
      {
        id: 4,
        title: "Security Groups vs. NACLs",
        subtitle: "Stateful Virtual Firewalls vs. Stateless Subnet Filters",
        bullets: [
          "Security Groups: Stateful virtual firewall at the instance/ENI level.",
          "  • Return traffic automatically allowed regardless of outbound rules.",
          "  • Only ALLOW rules; default deny everything else.",
          "Network Access Control Lists (NACLs): Stateless firewall at the subnet boundary.",
          "  • Return traffic must be explicitly permitted through ephemeral ports.",
          "  • Evaluates rules sequentially (Rule 100, 200, etc.); supports both ALLOW and DENY."
        ],
        diagram: `+-----------------------------------------------------------------+
| COMPARISON MATRIX:                                              |
| Feature            | Security Group         | NACL              |
|--------------------|------------------------|-------------------|
| Operates at        | Instance / ENI level   | Subnet boundary   |
| State Behavior     | Stateful               | Stateless         |
| Rules Supported    | Allow rules only       | Allow & Deny rules|
| Rule Evaluation    | All rules evaluated    | Ordered numerical |
+-----------------------------------------------------------------+`,
        keyTakeaway: "Use Security Groups for primary instance security; use NACLs to block specific malicious IP ranges at the subnet perimeter.",
        notes: "Walk through the stateful concept: If an HTTP request enters on port 80, Security Groups automatically let the HTTP response exit on port 49152 without special rules."
      },
      {
        id: 5,
        title: "Load Balancers: ALB vs. NLB",
        subtitle: "Layer 7 Application vs. Layer 4 Network Balancing",
        bullets: [
          "Application Load Balancer (ALB): Layer 7 (Application Layer).",
          "  • Understands HTTP/HTTPS headers, cookies, and URI paths.",
          "  • Routes \`/api\` to Node.js backend; routes \`/images\` to S3 bucket.",
          "  • Terminates SSL/TLS certificates; integrates with AWS WAF.",
          "Network Load Balancer (NLB): Layer 4 (Transport Layer - TCP/UDP).",
          "  • Ultra-high performance: handles tens of millions of requests per second.",
          "  • Sub-millisecond latency; supports static Elastic IP addresses."
        ],
        diagram: `ALB (Layer 7):
  Client -> [ALB:443] --- /api/* -----> [Backend Microservice]
                      --- /static/* --> [S3 / CDN Static Files]

NLB (Layer 4):
  Client -> [NLB] === Pure TCP/UDP Stream (Millions req/s) ===> [Gaming / VoIP Engine]`,
        keyTakeaway: "Choose ALB for web applications and microservices routing; choose NLB for extreme performance, gaming, or static IP requirements.",
        notes: "Explain health checks: Load balancers periodically ping target instances; if an instance fails 3 consecutive checks, traffic is diverted automatically."
      },
      {
        id: 6,
        title: "DNS & Content Delivery Networks (CDNs)",
        subtitle: "Amazon Route 53 and CloudFront Global Acceleration",
        bullets: [
          "DNS (e.g. Route 53): Translates domain names (\`example.com\`) into IP addresses.",
          "  • Routing Policies: Simple, Weighted, Latency-based, Failover (disaster recovery), Geolocation.",
          "CDN (e.g. CloudFront): Distributed network of Edge Locations / Points of Presence (PoPs) worldwide.",
          "  • Caches static assets (HTML, JS, CSS, MP4) close to users geographically.",
          "  • Drastically reduces round-trip latency and offloads origin server traffic by 80-90%."
        ],
        diagram: `User in Manila -> [Manila Edge Cache (CloudFront)] -> Instant 4ms response!
                        (Cache Miss)
                             v
                  [US-East Origin Server] (180ms round-trip avoided)`,
        keyTakeaway: "CDNs push static and dynamic cached content to the network edge, giving global users instant loading speeds.",
        notes: "Show how Route 53 health checks can automatically redirect traffic to a backup region if the primary region fails."
      },
      {
        id: 7,
        title: "VPC Peering, Transit Gateway & PrivateLink",
        subtitle: "Interconnecting Enterprise Cloud Networks",
        bullets: [
          "VPC Peering: Direct connection between two VPCs. Non-transitive (A<->B and B<->C does NOT allow A<->C).",
          "AWS Transit Gateway: Hub-and-spoke router connecting hundreds of VPCs and on-premises networks in a centralized fabric.",
          "AWS PrivateLink (VPC Endpoints): Access cloud services (S3, DynamoDB) privately over internal AWS network without traversing public internet.",
          "Improves security compliance and eliminates internet data egress charges."
        ],
        diagram: `[VPC 1 (App)]   --+
[VPC 2 (Auth)]  ---+---> [ AWS TRANSIT GATEWAY (Hub) ] <---> [Corporate DC]
[VPC 3 (DB)]    --+`,
        keyTakeaway: "Transit Gateways simplify complex enterprise mesh networks into an easily governed hub-and-spoke architecture.",
        notes: "Module 2 complete! We've covered Virtualization, Cloud Storage, and Cloud Networking."
      }
    ],
    quiz: {
      title: "Chapter 7 Assessment: Cloud Networking",
      time_limit_minutes: 10,
      passing_percentage: 75,
      questions: [
        {
          question_text: "What does VPC stand for in cloud computing?",
          option_a: "Virtual Private Cloud",
          option_b: "Virtual Public Connection",
          option_c: "Variable Protocol Controller",
          option_d: "Verified Personal Computer",
          correct_option: "A",
          explanation: "VPC stands for Virtual Private Cloud, a logically isolated virtual network dedicated to your cloud account."
        },
        {
          question_text: "In CIDR notation, how many total IP addresses are in a /24 network block?",
          option_a: "65,536",
          option_b: "256",
          option_c: "16",
          option_d: "1,024",
          correct_option: "B",
          explanation: "A /24 IPv4 CIDR block leaves 32 - 24 = 8 bits for host addresses, yielding 2^8 = 256 total IP addresses."
        },
        {
          question_text: "How many IP addresses does AWS reserve for internal networking purposes in every subnet?",
          option_a: "0 addresses",
          option_b: "5 addresses (Network, VPC router, DNS, future use, and broadcast)",
          option_c: "100 addresses",
          option_d: "1 address",
          correct_option: "B",
          explanation: "AWS reserves the first 4 and last 1 IP addresses in every subnet (e.g., .0, .1, .2, .3, and .255 in a /24), leaving 251 usable."
        },
        {
          question_text: "What distinguishes a Public Subnet from a Private Subnet in a VPC?",
          option_a: "Public subnets use Windows; private subnets use Linux",
          option_b: "A public subnet has a route table entry pointing directly to an Internet Gateway (IGW)",
          option_c: "Public subnets are completely unencrypted",
          option_d: "Private subnets do not require IP addresses",
          correct_option: "B",
          explanation: "A subnet is classified as public if its route table directs default outbound internet traffic (0.0.0.0/0) to an Internet Gateway."
        },
        {
          question_text: "What is the purpose of a NAT Gateway in a cloud VPC?",
          option_a: "To allow public internet users to hack database servers",
          option_b: "To allow instances in a private subnet to initiate outbound connections to the internet (for updates) while preventing unsolicited inbound connections from the internet",
          option_c: "To speed up audio streaming for video games",
          option_d: "To assign physical MAC addresses to server racks",
          correct_option: "B",
          explanation: "A NAT Gateway allows instances in private subnets to reach out to the internet (e.g. for software patches) while blocking inbound connections."
        },
        {
          question_text: "What is the primary operational difference between Security Groups and Network Access Control Lists (NACLs)?",
          option_a: "Security Groups are stateful (instance level); NACLs are stateless (subnet level)",
          option_b: "Security Groups only work on Mondays; NACLs work every day",
          option_c: "Security Groups require hardware cables; NACLs run in software",
          option_d: "NACLs are stateful; Security Groups are stateless",
          correct_option: "A",
          explanation: "Security Groups are stateful firewalls operating at the instance/ENI level; NACLs are stateless boundary filters operating at the subnet level."
        },
        {
          question_text: "If you permit inbound traffic on port 443 in a stateful Security Group, what outbound rule is required for the response traffic?",
          option_a: "You must create an outbound rule permitting port 443 explicitly",
          option_b: "No outbound rule is needed because stateful firewalls automatically allow response traffic for permitted inbound sessions",
          option_c: "You must restart the virtual machine",
          option_d: "You must configure a NAT Gateway",
          correct_option: "B",
          explanation: "Because Security Groups are stateful, return traffic for an established inbound connection is automatically tracked and permitted out."
        },
        {
          question_text: "Which type of firewall rules are supported by Network Access Control Lists (NACLs)?",
          option_a: "ALLOW rules only",
          option_b: "Both explicit ALLOW and explicit DENY rules, evaluated in numerical order",
          option_c: "DENY rules only",
          option_d: "No rules; NACLs are open by default",
          correct_option: "B",
          explanation: "NACLs support both ALLOW and DENY rules, evaluating rules in ascending numerical order until a match occurs."
        },
        {
          question_text: "Which AWS Load Balancer operates at Layer 7 of the OSI model and can route traffic based on HTTP request path or host headers?",
          option_a: "Classic Load Balancer (CLB)",
          option_b: "Application Load Balancer (ALB)",
          option_c: "Network Load Balancer (NLB)",
          option_d: "Gateway Load Balancer (GWLB)",
          correct_option: "B",
          explanation: "Application Load Balancers (ALB) operate at Layer 7, providing path-based, host-based, query-string, and HTTP header routing."
        },
        {
          question_text: "Which Load Balancer operates at Layer 4 (TCP/UDP) and is engineered for ultra-high throughput with tens of millions of requests per second?",
          option_a: "Application Load Balancer (ALB)",
          option_b: "Network Load Balancer (NLB)",
          option_c: "Session Load Balancer",
          option_d: "Content Routing Balancer",
          correct_option: "B",
          explanation: "Network Load Balancers (NLB) operate at Layer 4 (Transport layer), delivering sub-millisecond latencies and handling extreme traffic spikes."
        },
        {
          question_text: "What is Amazon Route 53?",
          option_a: "A physical highway in Seattle, Washington",
          option_b: "A highly available and scalable cloud Domain Name System (DNS) web service",
          option_c: "A network firewall for filtering DDoS attacks",
          option_d: "A server monitoring tool for CPU temperatures",
          correct_option: "B",
          explanation: "Amazon Route 53 is AWS's authoritative cloud DNS service (named after TCP/UDP port 53 used by DNS)."
        },
        {
          question_text: "What is the primary function of a Content Delivery Network (CDN) such as Amazon CloudFront?",
          option_a: "To replace all database servers with flat text files",
          option_b: "To cache static and dynamic web content at global edge locations close to users, reducing latency and origin server load",
          option_c: "To compile C++ source code in the cloud",
          option_d: "To physically mail hard drives to customer offices",
          correct_option: "B",
          explanation: "CDNs cache content at geographically distributed Edge Points of Presence, serving users from the closest location for low latency."
        },
        {
          question_text: "What does 'Non-Transitive' mean in VPC Peering?",
          option_a: "Traffic travels in one direction only",
          option_b: "If VPC A is peered with VPC B, and VPC B is peered with VPC C, VPC A cannot communicate with VPC C through VPC B without a direct peering link",
          option_c: "VPC peering does not support IPv4",
          option_d: "Peering connections automatically expire after 1 hour",
          correct_option: "B",
          explanation: "VPC peering is non-transitive; edge routing through intermediate VPCs is prohibited. Direct peering or a Transit Gateway is required."
        },
        {
          question_text: "What AWS service acts as a centralized cloud hub router connecting thousands of VPCs and on-premises networks in a hub-and-spoke model?",
          option_a: "AWS Transit Gateway",
          option_b: "Internet Gateway",
          option_c: "NAT Instance",
          option_d: "Route 53 Resolver",
          correct_option: "A",
          explanation: "AWS Transit Gateway is a central cloud router that simplifies networking by replacing complex mesh peering with a hub-and-spoke topology."
        },
        {
          question_text: "What is AWS PrivateLink (VPC Endpoints)?",
          option_a: "A private chat application for AWS developers",
          option_b: "A mechanism to privately connect your VPC to supported AWS services (like S3) without traversing the public internet",
          option_c: "A public URL shortener",
          option_d: "A tool to expose private databases directly to the public web",
          correct_option: "B",
          explanation: "AWS PrivateLink / VPC Endpoints allow instances in a private subnet to securely communicate with services like S3 over the private AWS backbone."
        },
        {
          question_text: "What is an Elastic IP address (EIP) in AWS?",
          option_a: "An IP address that stretches over physical cables",
          option_b: "A static, public IPv4 address allocated to your account that can be rapidly remapped to different instances during failures",
          option_c: "A private IP address that changes every 5 minutes",
          option_d: "An IP address assigned to mobile phones only",
          correct_option: "B",
          explanation: "An Elastic IP is a static public IPv4 address designed for dynamic cloud redirection, masking instance failures by remapping."
        },
        {
          question_text: "In a typical secure 3-tier web architecture, where should the relational database (e.g. MySQL) be placed?",
          option_a: "In the public subnet with an Internet Gateway route",
          option_b: "In a private subnet with no direct route to the Internet Gateway, accessible only by the application tier",
          option_c: "On a public CDN edge location",
          option_d: "Directly on an unencrypted DNS server",
          correct_option: "B",
          explanation: "Databases must reside in isolated private subnets, shielded from direct internet access and reachable only via application servers."
        },
        {
          question_text: "What Route 53 routing policy routes user DNS requests to the resource that provides the lowest network latency?",
          option_a: "Simple Routing",
          option_b: "Latency-Based Routing",
          option_c: "Geolocation Routing",
          option_d: "Weighted Routing",
          correct_option: "B",
          explanation: "Latency-based routing directs users to the cloud region that delivers the fastest response time based on network telemetry."
        },
        {
          question_text: "What is the primary role of a Route Table in a VPC?",
          option_a: "A table listing employee names and phone numbers",
          option_b: "A set of rules (routes) that determine where network packets from subnets or gateways are directed",
          option_c: "A database table that records SQL transactions",
          option_d: "A hardware table used to assemble physical servers",
          correct_option: "B",
          explanation: "Route tables contain destination CIDR blocks and target gateways/interfaces, dictating packet paths inside the virtual network."
        },
        {
          question_text: "What is an Ephemeral Port range, and why is it important in stateless NACL rule configuration?",
          option_a: "Ports 1-1024 used for secure web browsing",
          option_b: "Short-lived client port ranges (typically 1024-65535) used for return traffic, which stateless NACLs must permit on outbound rules",
          option_c: "Physical USB ports on a server front panel",
          option_d: "Virtual ports that only exist during leap years",
          correct_option: "B",
          explanation: "Clients use ephemeral ports (1024-65535) as temporary source ports; stateless firewalls must allow return traffic on this range."
        }
      ]
    }
  }
];

