pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract RealEstateDapp is ERC721URIStorage {
    //Counters is a library, this command imports all functions inside the library
    using Counters for Counters.Counter;

    //Intialising variables
    Counters.Counter private _allTokenID;
    Counters.Counter private _solditems;
    address payable propowner = payable(msg.sender);
    uint256 listPrice = 0.001 ether;

    //Structure for information related to a property listing
    struct PropListing {
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }

    //events in Solidity are emitted when a condition is fulfilled, in this case when token for new listing creation is created successfully
    event ListingSuccess(
        uint256 indexed tokenId,
        address seller,
        uint256 price,
        bool currentlyListed
    );

    //This is similar to HashMap in Java and maps token id with corresponding property details
    mapping(uint256 => PropListing) private propinfo;

    //Constructor
    constructor() ERC721("RealEstateDapp", "REDAPP") {
        propowner = payable(msg.sender);
    }

    //Function #1 - Updates info of a particular property listing whose id is passed as parameter
    function updateCost(uint256 _id, uint256 _listPrice)
        public
        payable
        returns (bool)
    {
        propinfo[_id].price = _listPrice;
        return true;
    }

    //Function #2 - Fetches the price of a listing
    function getPrice() public view returns (uint256) {
        return listPrice;
    }

    //Function #6 - Function to create new token when new listing is created
    function createPropListing(string memory tokenURI, uint256 price)
        public
        payable
        returns (uint256)
    {
        _allTokenID.increment();
        uint256 newTokenId = _allTokenID.current();

        _safeMint(msg.sender, newTokenId);

        _setTokenURI(newTokenId, tokenURI);

        helper(newTokenId, price);

        return newTokenId;
    }

    //Function #7 - Supporting function for function#6
    function helper(uint256 tokenId, uint256 price) private {
        require(
            msg.value == listPrice,
            "verifying if user is sending the correct price"
        );

        require(price > 0, "verifying the price is a positive number");

        propinfo[tokenId] = PropListing(
            tokenId,
            payable(msg.sender),
            price,
            true
        );

        _transfer(msg.sender, address(this), tokenId);

        emit ListingSuccess(tokenId, msg.sender, price, true);
    }

    //Function #8 - Fetch all the property listings
    function getAllListings() public view returns (PropListing[] memory) {
        uint256 listingsCount = _allTokenID.current();
        PropListing[] memory tokens = new PropListing[](listingsCount);
        uint256 k = 0;

        for (uint256 i = 0; i < listingsCount; i++) {
            PropListing storage prop = propinfo[i + 1];
            tokens[k] = prop;
            k += 1;
        }

        return tokens;
    }

    //Function #9 - Fetch investments of a particular user
    function getUserInvestments() public view returns (PropListing[] memory) {
        uint256 total = _allTokenID.current();
        uint256 mylistings = 0;
        uint256 k = 0;

        for (uint256 i = 0; i < total; i++) {
            if (propinfo[i + 1].seller == msg.sender) {
                mylistings += 1;
            }
        }

        PropListing[] memory userprops = new PropListing[](mylistings);
        for (uint256 i = 0; i < total; i++) {
            if (propinfo[i + 1].seller == msg.sender) {
                PropListing storage prop = propinfo[i + 1];
                userprops[k] = prop;
                k += 1;
            }
        }
        return userprops;
    }

    //Function #10 - Function to execute transfer of ownership during property sale
    function propertySale(uint256 tokenId) public payable {
        uint256 price = propinfo[tokenId].price;
        address seller = propinfo[tokenId].seller;
        require(
            msg.value == price,
            "Please pay the selling price of the property to complete transaction"
        );

        propinfo[tokenId].seller = payable(msg.sender);
        _solditems.increment();

        _transfer(address(this), msg.sender, tokenId);

        approve(address(this), tokenId);

        payable(seller).transfer(listPrice);

        payable(seller).transfer(msg.value);
    }

    function updateCurrentlyListed(uint256 _id, bool _currentlyListed)
        public
        payable
        returns (bool)
    {
        propinfo[_id].currentlyListed = _currentlyListed;
        return true;
    }
}
