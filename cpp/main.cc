#include <cereal/cereal.hpp>
#include <cereal/archives/json.hpp>
#include <cereal/types/vector.hpp>
#include <iostream>
#include <cmath>
#include <vector>
#include <time.h>
#include <unistd.h>
#include <sys/socket.h>
#include <sys/un.h>

#define SOCKET_FILE "../unix_socket"

int onError(const char* err, int socket_fd)
{
	if (socket_fd != -1)
		close(socket_fd);
	std::cerr << "TraceLog: server: "<< err << std::endl;
	return (-1);
}

double calcTime(timespec &start, timespec &end)
{
	return (static_cast<double>(end.tv_sec + end.tv_nsec * 0.000000001 - start.tv_sec - start.tv_nsec * 0.000000001));
}

struct ShareData
{
	int		socket_fd;
	char	rbuf[256];
	struct	sockaddr_un addr;
	int Init();
	ssize_t Send(const char * msg);
	ssize_t Recv(char *buf, size_t size);
	void Close();
};

int ShareData::Init()
{
	if ((socket_fd = socket(AF_UNIX, SOCK_STREAM, 0)) == -1)
		return (onError("socket_fd != 0", socket_fd));
	addr.sun_family = AF_UNIX;
	strcpy(addr.sun_path, SOCKET_FILE);
	if (connect(socket_fd, (struct sockaddr*) &addr, sizeof(struct sockaddr_un)) != 0)
		return (onError("connect failed.", socket_fd));
	return (0);
}

ssize_t ShareData::Send(const char * msg)
{
	ssize_t res;
	if ((res = write(socket_fd, msg, strlen(msg))) == -1)
		return (onError("write failed.", socket_fd));
	return (res);
}

ssize_t ShareData::Recv(char *rbuf, size_t size)
{
	ssize_t res;
	res = read(socket_fd, rbuf, size);
	rbuf[res] = '\0';
	return (res);
}

void ShareData::Close()
{
	close(socket_fd);
}

struct Joint
{
	uint8_t id;
	double x, dx, ddx, f;

	template <class Archive>
	void serialize( Archive & ar )
	{
		ar(
		CEREAL_NVP(id),
		CEREAL_NVP(x),
		CEREAL_NVP(dx),
		CEREAL_NVP(ddx),
		CEREAL_NVP(f)
		);
	}
};

struct Manipulator
{
	std::vector<Joint> joints;

	template <class Archive>
	void serialize( Archive & ar )
	{
		ar(
		CEREAL_NVP(joints)
		);
	}
};

int main()
{
	size_t	res;
	char	rbuf[256];
	double time = 0;
	double x = 0;
	ShareData shr;
	struct timespec start, end;
	Manipulator m;
	if (shr.Init())
		std::cout << "error in init\n";
	m.joints.push_back({0, 0.0, 1.2, 0.4, 0.5});
	clock_gettime(CLOCK_MONOTONIC, &start);
	while (1 || time < 100.0)
	{
		clock_gettime(CLOCK_MONOTONIC, &end);
		time = calcTime(start, end);
		x = 0.5 * sin(2.0 * M_PI * time);
		m.joints[0].dx = x - m.joints[0].x;
		m.joints[0].x = x;
		{
			std::stringstream ss;
			{
				cereal::JSONOutputArchive archive(ss);
				archive(cereal::make_nvp("manipulator", m));
			}
			if (shr.Send(ss.str().c_str()) == -1)
				return (-1);
			if ((res = shr.Recv(rbuf, sizeof(rbuf))) == -1)
				return (onError("write failed.", -1));
			else if (!res)
				break ;
		}
	}
	return 0;
}
