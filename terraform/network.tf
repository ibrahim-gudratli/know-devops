resource "aws_vpc" "know" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name    = "know-vpc"
    Project = "know-devops"
  }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.know.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name    = "know-public-subnet"
    Project = "know-devops"
  }
}

resource "aws_internet_gateway" "know" {
  vpc_id = aws_vpc.know.id

  tags = {
    Name    = "know-igw"
    Project = "know-devops"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.know.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.know.id
  }

  tags = {
    Name    = "know-public-rt"
    Project = "know-devops"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_subnet" "private_db_a" {
  vpc_id            = aws_vpc.know.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "eu-north-1a"

  tags = {
    Name    = "know-private-db-a"
    Project = "know-devops"
  }
}

resource "aws_subnet" "private_db_b" {
  vpc_id            = aws_vpc.know.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "eu-north-1b"

  tags = {
    Name    = "know-private-db-b"
    Project = "know-devops"
  }
}
