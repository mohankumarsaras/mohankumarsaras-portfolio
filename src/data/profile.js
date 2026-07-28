/**
 * profile.js
 * ----------
 * Single source of truth for all personal content on the site.
 *
 * Fill in every [PLACEHOLDER] below using your LinkedIn profile as a guide:
 * https://www.linkedin.com/in/mohankumarsaras/
 *
 * Nothing in this file is fetched automatically from LinkedIn — copy the
 * details over by hand. That keeps you in full control of what's public,
 * avoids LinkedIn's anti-scraping restrictions, and lets you word things
 * for a portfolio audience rather than a recruiter-search audience.
 */

export const profile = {
  name: "Mohankumar Saraswathy",
  title: "AWS DevOps Engineer",
  location: "Salem, Tamil Nadu, India",
  email: "mohankumar.saraswathy@gmail.com",
  phone: "+91 8675553162",
  linkedin: "https://www.linkedin.com/in/mohankumarsaras/",
  github: "https://github.com/mohankumarsaras",

  // Shown by the `whoami` / `about` command
  summary: `AWS DevOps Engineer specializing in cloud infrastructure automation, container orchestration, and continuous integration/continuous delivery (CI/CD) pipelines. This interactive terminal portfolio is designed to showcase my skills, professional experience, and key projects in a command-line environment, simulating a classic developer terminal.`,

  // Shown by the `whoami` command, short version
  tagline: "AWS DevOps Engineer | CI/CD | Terraform | Kubernetes",

  // Shown by the `skills` command. Group however your LinkedIn "Skills" section is grouped.
  skills: [
    {
      category: "Cloud Platforms",
      items: ["Amazon Web Services (AWS)", "Microsoft Azure"],
    },
    {
      category: "CI/CD & Automation",
      items: ["GitHub Actions", "Jenkins", "GitLab CI", "ArgoCD"],
    },
    {
      category: "Infrastructure as Code",
      items: ["Terraform", "CloudFormation"],
    },
    {
      category: "Containers & Orchestration",
      items: ["Docker", "Kubernetes (EKS)", "Amazon ECS"],
    },
    {
      category: "Scripting & Languages",
      items: ["Bash", "Python", "JavaScript", "YAML"],
    },
  ],

  // Shown by the `experience` command. Copy roles from LinkedIn "Experience".
  experience: [
    {
      company: "Siddha AI Inc.",
      slug: "siddha_ai_inc",
      projectSlug: "siddha-patient-intake",
      role: "DevOps Engineer",
      duration: "Mar 2024 – Present",
      experience: "3.3 Years",
      location: "",
      client: "Orthopedic Spine Institution, USA",
      project: "SaaS Healthcare Platform – Siddha Patient Intake",
      technologies: [
        "CloudWatch", "CloudTrail", "AWS Config", "Logging", "Alerts", "Nginx",
        "Apache HTTP Server", "LoadRunner", "JMeter", "WinSCP", "PuTTY", "AWS CLI",
        "Linux", "Troubleshooting", "Documentation", "Cost Optimization", "Environment Management",
      ],
      highlights: [
        "Designed and deployed multi-environment SaaS architecture (Dev/QC/Prod) using EC2, RDS, CloudFront, S3, IAM, EFS, ALB, and ASG.",
        "Built secure VPC networks including private/public subnets, routing, NAT gateways, and fine-grained access control.",
        "Implemented CI/CD pipelines using AWS DevOps integrated with GitHub for automated builds, tests, and deployments.",
        "Adopted Infrastructure as Code with CloudFormation for consistent and repeatable provisioning.",
        "Configured ALB + Auto Scaling for high availability, fault tolerance, and load management.",
        "Monitored resource utilization, logs, and compliance using CloudWatch, CloudTrail, AWS Config, and AWS CLI.",
        "Managed Dev/QC/Prod environments including deployments, troubleshooting, security hardening, and cost optimization.",
        "Documented architecture, deployment steps, CI/CD flows, SOPs, and performance metrics.",
        "Collaborated with product, backend, and QA teams via Azure Boards for smooth delivery.",
      ],
    },
    {
      company: "Wipro Technologies Pvt Ltd.",
      slug: "wipro_technologies_pvt_ltd",
      projectSlug: "lloyds-digital-banking",
      role: "Performance Test Engineer",
      duration: "Jun 2019 – Jul 2022",
      experience: "3.3 Years",
      location: "Chennai, Tamil Nadu, India",
      client: "Lloyds Banking Group, UK",
      project: "Digital Banking Systems Performance Engineering",
      technologies: ["LoadRunner", "JMeter", "Performance Monitor", "Git", "AWS CI/CD"],
      highlights: [
        "Performed load, stress, and scalability testing for high-traffic banking applications.",
        "Developed test scripts and scenarios using LoadRunner and JMeter.",
        "Implemented AWS CI/CD pipelines with Git for automated build and test workflows.",
        "Ensured digital banking systems could handle large concurrent user volumes and transaction loads.",
        "Analyzed performance metrics using LoadRunner Analysis & Performance Monitor.",
        "Identified bottlenecks and provided optimization guidance to development teams.",
        "Delivered detailed performance reports covering trends, throughput, latency, and error diagnostics.",
      ],
    },
  ],

  // Shown by the `projects` command / `ls projects`
  projects: [
    {
      name: "SaaS Healthcare Automation – Siddha Patient Intake",
      slug: "siddha-patient-intake",
      organization: "Siddha AI Inc.",
      client: "Orthopedic Spine Institution, USA",
      category: "Cloud / DevOps / SaaS Healthcare",
      description: "Multi-environment SaaS healthcare platform automation and operations for Siddha Patient Intake.",
      highlights: ["Multi-environment architecture & Version Control", "AWS CI/CD & Azure DevOps (Agile)", "AWS IaC (CloudFormation)", "Service automation with SNS and EventBridge", "Cost optimization", "Performance tuning", "Docker / ECS"],
      stack: ["AWS", "EC2", "RDS", "S3", "CloudFront", "IAM", "EFS", "ALB", "Auto Scaling", "VPC", "NAT Gateway", "CloudFormation", "SNS", "EventBridge", "CloudWatch", "CloudTrail", "AWS Config", "Docker", "ECS", "GitHub", "Azure DevOps", "Nginx", "Linux"],
    },
    {
      name: "Lloyds Banking Group – Digital Banking",
      slug: "lloyds-digital-banking",
      organization: "Wipro Technologies Pvt Ltd.",
      client: "Lloyds Banking Group, UK",
      category: "Performance Engineering / Banking",
      description: "Performance engineering and reliability validation for digital banking systems.",
      highlights: ["Load testing", "Stress testing", "Spike testing", "Performance bottleneck identification", "Enterprise-scale reliability validation", "Concurrent-user workload validation", "Transaction-load validation", "Performance reporting and analysis"],
      stack: ["LoadRunner", "JMeter", "Performance Monitor", "Git", "AWS CI/CD"],
    },
    {
      name: "EKS Deployment Automation",
      description: "Fully automated EKS cluster provisioning with custom node groups, integrated with ArgoCD for GitOps CD.",
      stack: ["Terraform", "Kubernetes", "AWS EKS", "ArgoCD"],
      link: "https://github.com/mohankumarsaras/eks-automation",
    },
    {
      name: "Serverless Image Processor",
      description: "AWS Lambda and S3 event-driven serverless application that processes and optimizes uploaded images.",
      stack: ["Python", "AWS Lambda", "S3", "CloudFormation"],
      link: "https://github.com/mohankumarsaras/serverless-image-processor",
    },
    {
      name: "DevOps Terminal Portfolio",
      description: "Interactive retro-monochrome Linux terminal style portfolio site built in React and Vite.",
      stack: ["React.js", "Vite", "JavaScript", "CSS"],
      link: "https://github.com/mohankumarsaras/terminal-portfolio",
    },
  ],

  // Shown by the `certifications` command
  certifications: [
    "AWS Certified Cloud Practitioner – Foundational",
    "Meta Certified Version Control",
    "AWS SimuLearn - AI Practitioner - Training Badge",
    "Well-Architected Proficient",
  ],

// Shown by the `education` command
  education: [
    {
      degree: "B.Tech in Information Technology",
      institution: "V.S.B. Engineering College",
      duration: "2015 – 2019",
      score: "CGPA: 7.32",
      level: "Undergraduate",
    },
    {
      degree: "Higher Secondary Certificate (HSC)",
      institution: "Vivekananda Vidhyalaya Hr. Sec. School",
      duration: "2013 - 2015",
      score: "79.5%",
      level: "Higher Secondary Certification",
    },
    {
      degree: "Secondary School Leaving Certificate (SSLC)",
      institution: "Government High School",
      duration: "2003 - 2013",
      score: "82.6%",
      level: "Secondary School Level Certification",
    },
  ],
};
