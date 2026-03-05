// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Crowdfunding {
    struct Campaign {
        uint256 id;
        address creator;
        string title;
        string description;
        uint256 goal;
        uint256 deadline;
        uint256 amountRaised;
        bool withdrawn;
        bool exists;
    }

    uint256 public campaignCount;

    mapping(uint256 => Campaign) private campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions;

    event CampaignCreated(
        uint256 indexed id,
        address indexed creator,
        string title,
        uint256 goal,
        uint256 deadline
    );

    event Funded(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount
    );

    event Withdrawn(uint256 indexed campaignId, uint256 amount);
    event Refunded(uint256 indexed campaignId, address indexed contributor, uint256 amount);

    function createCampaign(
        string calldata _title,
        string calldata _description,
        uint256 _goal,
        uint256 _duration
    ) external returns (uint256) {
        require(_goal > 0, "Goal must be > 0");
        require(_duration > 0, "Duration must be > 0");

        campaignCount += 1;
        uint256 id = campaignCount;

        uint256 deadline = block.timestamp + _duration;

        campaigns[id] = Campaign({
            id: id,
            creator: msg.sender,
            title: _title,
            description: _description,
            goal: _goal,
            deadline: deadline,
            amountRaised: 0,
            withdrawn: false,
            exists: true
        });

        emit CampaignCreated(id, msg.sender, _title, _goal, deadline);
        return id;
    }

    function fundCampaign(uint256 _id) external payable {
        Campaign storage c = campaigns[_id];
        require(c.exists, "Campaign not found");
        require(block.timestamp < c.deadline, "Campaign ended");
        require(msg.value > 0, "Send ETH");

        c.amountRaised += msg.value;
        contributions[_id][msg.sender] += msg.value;

        emit Funded(_id, msg.sender, msg.value);
    }

    function withdrawFunds(uint256 _id) external {
        Campaign storage c = campaigns[_id];
        require(c.exists, "Campaign not found");
        require(msg.sender == c.creator, "Not creator");
        require(c.amountRaised >= c.goal, "Goal not reached");
        require(!c.withdrawn, "Already withdrawn");

        c.withdrawn = true;

        uint256 amount = c.amountRaised;

        (bool ok, ) = payable(c.creator).call{value: amount}("");
        require(ok, "Transfer failed");

        emit Withdrawn(_id, amount);
    }

    function refund(uint256 _id) external {
        Campaign storage c = campaigns[_id];
        require(c.exists, "Campaign not found");
        require(block.timestamp >= c.deadline, "Campaign still active");
        require(c.amountRaised < c.goal, "Goal was reached");

        uint256 contributed = contributions[_id][msg.sender];
        require(contributed > 0, "No contribution");

        contributions[_id][msg.sender] = 0;

        (bool ok, ) = payable(msg.sender).call{value: contributed}("");
        require(ok, "Refund failed");

        emit Refunded(_id, msg.sender, contributed);
    }

    function getCampaign(uint256 _id) external view returns (Campaign memory) {
        Campaign memory c = campaigns[_id];
        require(c.exists, "Campaign not found");
        return c;
    }

    function getCampaigns(uint256 startId, uint256 limit)
        external
        view
        returns (Campaign[] memory)
    {
        if (campaignCount == 0 || startId == 0 || startId > campaignCount || limit == 0) {
            return new Campaign[](0);
        }

        uint256 end = startId + limit - 1;
        if (end > campaignCount) end = campaignCount;

        uint256 size = end - startId + 1;
        Campaign[] memory arr = new Campaign[](size);

        uint256 idx = 0;
        for (uint256 i = startId; i <= end; i++) {
            arr[idx] = campaigns[i];
            idx++;
        }

        return arr;
    }
}
