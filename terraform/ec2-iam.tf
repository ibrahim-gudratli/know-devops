# IAM role that the EC2 instance can assume
resource "aws_iam_role" "ec2" {
  name = "know-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "ec2.amazonaws.com"
        }

        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Project = "know-devops"
  }
}


# Allow EC2 to authenticate to ECR and pull our Docker images
resource "aws_iam_role_policy" "ec2_ecr" {
  name = "know-ec2-ecr"
  role = aws_iam_role.ec2.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "ecr:GetAuthorizationToken"
        ]

        Resource = "*"
      },
      {
        Effect = "Allow"

        Action = [
          "ecr:BatchGetImage",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchCheckLayerAvailability"
        ]

        Resource = [
          aws_ecr_repository.frontend.arn,
          aws_ecr_repository.backend.arn
        ]
      }
    ]
  })
}


# Allow AWS Systems Manager to manage/deploy to the EC2 instance
resource "aws_iam_role_policy_attachment" "ec2_ssm" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}


# Instance profile connects the IAM role to EC2
resource "aws_iam_instance_profile" "ec2" {
  name = "know-ec2-profile"
  role = aws_iam_role.ec2.name
}


# Allow EC2 to send backend container logs to CloudWatch
resource "aws_iam_role_policy" "ec2_cloudwatch_logs" {
  name = "know-ec2-cloudwatch-logs"
  role = aws_iam_role.ec2.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]

        Resource = "arn:aws:logs:eu-north-1:424822286690:log-group:/know/backend:log-stream:*"
      }
    ]
  })
}