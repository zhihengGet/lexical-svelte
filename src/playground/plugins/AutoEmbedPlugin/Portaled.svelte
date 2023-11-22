<div
            className="typeahead-popover auto-embed-menu"
            style={{
              marginLeft: anchorElementRef.current.style.width,
              width: 200,
            }}>
            <AutoEmbedMenu
              options={options}
              selectedItemIndex={selectedIndex}
              onOptionClick={(option: AutoEmbedOption, index: number) => {
                setHighlightedIndex(index);
                selectOptionAndCleanUp(option);
              }}
              onOptionMouseEnter={(index: number) => {
                setHighlightedIndex(index);
              }}
            />
          </div>